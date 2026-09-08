#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
temp_root="${TMPDIR:-$(python3 -c 'import tempfile; print(tempfile.gettempdir())')}"
data_home="${XDG_DATA_HOME:-$HOME/.local/share}"
demo_dir="${DEMO_DIR:-$temp_root/perch-demo}"
kokoro_home="${KOKORO_HOME:-$data_home/perch-video/kokoro}"
python="${DEMO_PYTHON:-$kokoro_home/.venv/bin/python}"
speak="${DEMO_SPEAK:-$script_dir/speak.py}"
script="${DEMO_SCRIPT:-$script_dir/narration.txt}"
source="${DEMO_SOURCE:-$demo_dir/capture-joined.mp4}"
output="${DEMO_OUT:-$demo_dir/TolongLabs.mp4}"
ffmpeg="${DEMO_FFMPEG:-$(command -v ffmpeg || true)}"
ffprobe="${DEMO_FFPROBE:-$(command -v ffprobe || true)}"
fps="${DEMO_FPS:-25}"
preset="${DEMO_PRESET:-veryfast}"
segments="$demo_dir/narration-segments"

require_command() {
  command -v "$1" >/dev/null 2>&1 || [ -x "$1" ] || { echo "missing command: $1" >&2; exit 1; }
}

require_command "$python"
require_command "$ffmpeg"
require_command "$ffprobe"
for input in "$source" "$demo_dir/beats.json" "$script" "$speak"; do
  [ -f "$input" ] || { echo "missing: $input" >&2; exit 1; }
done
[ "$source" != "$output" ] || { echo "DEMO_OUT must differ from DEMO_SOURCE" >&2; exit 1; }

mkdir -p "$demo_dir" "$segments" "$(dirname -- "$output")"
python3 "$script_dir/schedule.py" resolve "$demo_dir" "$script"
line_count="$(python3 - "$demo_dir/lines.json" <<'PY'
import json
import sys
from pathlib import Path

print(len(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))))
PY
)"

for ((index = 0; index < line_count; index += 1)); do
  python3 - "$demo_dir/lines.json" "$index" <<'PY' | "$python" "$speak" "$segments/$index.wav"
import json
import sys
from pathlib import Path

lines = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
print(lines[int(sys.argv[2])]['text'])
PY
done

python3 "$script_dir/schedule.py" deconflict "$demo_dir"
python3 "$script_dir/subtitles.py" "$demo_dir"

inputs=()
filters=''
labels=''
for ((index = 0; index < line_count; index += 1)); do
  start_ms="$(python3 - "$demo_dir/lines.json" "$index" <<'PY'
import json
import sys
from pathlib import Path

lines = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
print(lines[int(sys.argv[2])]['ms'])
PY
)"
  inputs+=(-i "$segments/$index.wav")
  filters+="[$index:a]adelay=$start_ms:all=1[n$index];"
  labels+="[n$index]"
done

"$ffmpeg" -y -loglevel error "${inputs[@]}" \
  -filter_complex "${filters}${labels}amix=inputs=$line_count:normalize=0:dropout_transition=0[narration]" \
  -map '[narration]' -ar 48000 -c:a pcm_s16le "$demo_dir/narration.wav"

video_seconds="$("$ffprobe" -v error -show_entries format=duration -of csv=p=0 "$source")"
audio_seconds="$("$ffprobe" -v error -show_entries format=duration -of csv=p=0 "$demo_dir/narration.wav")"
tail_seconds="$(python3 - "$video_seconds" "$audio_seconds" <<'PY'
import sys

video, audio = (float(value) for value in sys.argv[1:])
print(f'{max(0, audio - video + 0.4):.3f}')
PY
)"

fit="scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#F5F7F5,fps=$fps,format=yuv420p"
if python3 - "$tail_seconds" <<'PY'
import sys

raise SystemExit(0 if float(sys.argv[1]) > 0 else 1)
PY
then
  fit="tpad=stop_mode=clone:stop_duration=$tail_seconds,$fit"
fi
# The subtitles are the only type in every frame, so they should be the product's own face rather than whatever
# libass falls back to. Point DEMO_FONTSDIR at a directory holding a static TTF; libass cannot read woff2, so the
# app's variable Quicksand has to be instanced and converted first. See the README.
subtitle_font="${DEMO_SUBTITLE_FONT:-DejaVu Sans}"
subtitle_size="${DEMO_SUBTITLE_SIZE:-14}"
fontsdir="${DEMO_FONTSDIR:-}"
subtitle_style="FontName=$subtitle_font,FontSize=$subtitle_size,PrimaryColour=&H00FFFFFF,OutlineColour=&H40101010,BorderStyle=3,Outline=3,Shadow=0,Alignment=2,MarginV=28"
subtitle_filter="subtitles=filename=narration.srt:force_style='$subtitle_style'"
if [ -n "$fontsdir" ]; then
  subtitle_filter="subtitles=filename=narration.srt:fontsdir='$(realpath "$fontsdir")':force_style='$subtitle_style'"
fi
source_path="$(realpath "$source")"
audio_path="$(realpath "$demo_dir/narration.wav")"
output_path="$(cd -- "$(dirname -- "$output")" && pwd)/$(basename -- "$output")"

# A music bed is opt-in and has no default, so a run without DEMO_MUSIC is silent under the voice exactly as before.
# The level is derived rather than guessed: both the narration and the chosen slice of the bed are measured, and the
# bed is placed DEMO_MUSIC_DUCK decibels under the narration's mean. A fixed offset beats a guessed gain, because a
# quiet mix and a loud one need different numbers to sit in the same place.
music="${DEMO_MUSIC:-}"
music_start="${DEMO_MUSIC_START:-0}"
music_duck="${DEMO_MUSIC_DUCK:-20}"
music_fade_in="${DEMO_MUSIC_FADE_IN:-4}"
music_fade_out="${DEMO_MUSIC_FADE_OUT:-7}"

audio_inputs=()
audio_map='1:a'
audio_filter=''
if [ -n "$music" ]; then
  [ -f "$music" ] || { echo "missing music: $music" >&2; exit 1; }
  music_path="$(realpath "$music")"
  video_seconds="$("$ffprobe" -v error -show_entries format=duration -of csv=p=0 "$source_path")"
  mean_of() {
    "$ffmpeg" -hide_banner -nostats -i "$1" ${2:+-ss "$2"} -t "$3" -af volumedetect -f null /dev/null 2>&1 |
      sed -n 's/.*mean_volume: \(-\?[0-9.]*\) dB.*/\1/p' | tail -1
  }
  narration_mean="$(mean_of "$audio_path" "" "$video_seconds")"
  music_mean="$(mean_of "$music_path" "$music_start" "$video_seconds")"
  music_gain="$(python3 -c "print(round(($narration_mean - $music_duck) - ($music_mean), 2))")"
  fade_out_at="$(python3 -c "print(max(0, round($video_seconds - $music_fade_out, 3)))")"
  echo "music: bed ${music_duck}dB under narration (${narration_mean}dB), applying ${music_gain}dB from ${music_start}s"
  audio_inputs=(-ss "$music_start" -i "$music_path")
  audio_map='[audio]'
  # The narration ends before the picture does, and amix takes its first input's duration, so without padding the
  # voice out to the full video the mix stops early and the bed's fade-out is cut off partway through.
  audio_filter=";[1:a]apad=whole_dur=${video_seconds}[voice];[2:a]volume=${music_gain}dB,afade=t=in:st=0:d=${music_fade_in},afade=t=out:st=${fade_out_at}:d=${music_fade_out}[bed];[voice][bed]amix=inputs=2:duration=first:normalize=0[audio]"
fi

(
  cd "$demo_dir"
  "$ffmpeg" -y -loglevel error -i "$source_path" -i "$audio_path" "${audio_inputs[@]}" \
    -filter_complex "[0:v]$fit,$subtitle_filter[video]$audio_filter" \
    -map '[video]' -map "$audio_map" -c:v libx264 -preset "$preset" -crf 20 -pix_fmt yuv420p \
    -c:a aac -b:a 160k -movflags +faststart "$output_path"
)

final_seconds="$("$ffprobe" -v error -show_entries format=duration -of csv=p=0 "$output_path")"
printf 'video: %.1fs  narration: %.1fs  tail pad: %.1fs\n' "$final_seconds" "$audio_seconds" "$tail_seconds"
printf 'output: %s\n' "$output_path"
