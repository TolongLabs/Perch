#!/usr/bin/env bash
# Joins the product capture to the pitch slides and extends beats.json so the
# narration can name a slide the same way it names a moment on screen.
#
# The slides are stills, so their "beat" is simply where they start on the joined
# timeline. Writing them into beats.json rather than hardcoding timestamps keeps
# ONE scheduling model: narration.txt names a beat, schedule.py spaces the lines,
# and neither has to know which beats came from a browser and which from a PNG.
set -euo pipefail
DIR="${DEMO_DIR:-${TMPDIR:-/tmp}/codenection-demo}"
FF="${DEMO_FFMPEG:-$(command -v ffmpeg)}"
# "name:seconds", in the order they appear after the capture. Each name must match a
# slide HTML file in slides/ and becomes a beat that narration.txt can name.
#
# SIZE EACH ONE TO THE NARRATION IT CARRIES, measured from the rendered wavs rather
# than picked. On the project this came from, a slide given 21s for 12.6s of speech
# left eight seconds of a still frame with nobody talking over it, and one given 20s
# for 22.5s ran the closing line off the end of the picture.
DEMO_SLIDES="${DEMO_SLIDES:-arch:20 close:24}"

[ -f "$DIR/capture.webm" ] || { echo "missing $DIR/capture.webm" >&2; exit 1; }
[ -f "$DIR/beats.json" ] || { echo "missing $DIR/beats.json" >&2; exit 1; }
for pair in $DEMO_SLIDES; do
  f="$DIR/slide-${pair%%:*}.png"
  [ -f "$f" ] || { echo "missing $f (run slides/render.mjs first)" >&2; exit 1; }
done

# The capture is 1440x900; the slides are 1920x1080. Normalise both to 1920x1080
# here rather than at mux time, because concat demands identical streams and a
# mismatch fails silently by dropping frames rather than by erroring.
"$FF" -y -loglevel error -i "$DIR/capture.webm" \
  -vf "scale=1728:1080,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#F4F7F4,fps=25,format=yuv420p" \
  -an "$DIR/seg-capture.mp4"

for pair in $DEMO_SLIDES; do
  name="${pair%%:*}"; secs="${pair##*:}"
  "$FF" -y -loglevel error -loop 1 -t "$secs" -i "$DIR/slide-$name.png" \
    -vf "scale=1920:1080,fps=25,format=yuv420p" "$DIR/seg-$name.mp4"
done

printf "file '%s'\n" "$DIR/seg-capture.mp4" > "$DIR/concat.txt"
for pair in $DEMO_SLIDES; do printf "file '%s'\n" "$DIR/seg-${pair%%:*}.mp4" >> "$DIR/concat.txt"; done
"$FF" -y -loglevel error -f concat -safe 0 -i "$DIR/concat.txt" -c copy "$DIR/pitch.mp4"

python3 - "$DIR" "$DEMO_SLIDES" <<'PY'
import json, subprocess, sys
from pathlib import Path
d = Path(sys.argv[1])
slides = [(p.split(':')[0], int(p.split(':')[1])) for p in sys.argv[2].split()]

def secs(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                          '-of', 'csv=p=0', str(p)], capture_output=True, text=True).stdout.strip()
    return float(out)

cap = round(secs(d / 'seg-capture.mp4') * 1000)
beats = [b for b in json.loads((d / 'beats.json').read_text()) if b['name'] != 'end']
cursor = cap
for name, secs_ in slides:
    beats.append({'name': name, 'ms': cursor})
    cursor += secs_ * 1000
beats.append({'name': 'end', 'ms': cursor})
(d / 'beats.json').write_text(f'{json.dumps(beats, indent=2)}\n')
print(f'  capture {cap}ms + slides {cursor - cap}ms')
for b in beats:
    print(f'    {b["ms"]:>7}ms  {b["name"]}')
PY

mv "$DIR/pitch.mp4" "$DIR/capture-joined.mp4"
echo "joined: $DIR/capture-joined.mp4"
