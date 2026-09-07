#!/usr/bin/env bash
# Pull each reel in urls.tsv, cut it to a short muted vertical clip, and write a manifest the frontend reads.
# Runs on system yt-dlp and ffmpeg, adds nothing to package.json. See README.md for the cookie step.
set -euo pipefail
cd "$(dirname "$0")"

COOKIES="${COOKIES:-cookies.txt}"
OUT="${OUT:-out}"
SECONDS_KEEP="${SECONDS_KEEP:-8}"
mkdir -p raw "$OUT"

# Cookies are optional: public Instagram reels resolve anonymously. Xiaohongshu and rate-limited fetches need them.
COOKIE_ARGS=(); [ -f "$COOKIES" ] && COOKIE_ARGS=(--cookies "$COOKIES") || echo "no $COOKIES - fetching anonymously"

# urls.tsv: <place-slug> <tab> <url> [<tab> <seconds to skip at the start>]. Lines starting with # are skipped. The list
# is read on fd 3 so that yt-dlp and ffmpeg, which both read stdin, cannot swallow the remaining rows.
while IFS=$'\t' read -r -u 3 slug url skip; do
  [ -z "${slug:-}" ] && continue
  case "$slug" in \#*) continue ;; esac

  echo "== $slug"
  yt-dlp "${COOKIE_ARGS[@]}" --no-playlist --write-info-json --sleep-interval 3 --max-sleep-interval 8 \
    -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" \
    -o "raw/$slug.%(ext)s" "$url" < /dev/null || echo "not a video post, trying it as an image"

  src=""; for ext in mp4 webm mkv; do [ -f "raw/$slug.$ext" ] && src="raw/$slug.$ext" && break; done

  # An image post is fine too: a still judged on instinct is the mechanic. gallery-dl fetches it, or drop a file
  # named raw/<slug>.jpg by hand. It becomes an eight second slow zoom at the same size, so the card never branches.
  still=""
  if [ -z "$src" ]; then
    for ext in jpg jpeg png webp; do [ -f "raw/$slug.$ext" ] && still="raw/$slug.$ext" && break; done
    if [ -z "$still" ]; then
      uvx gallery-dl "${COOKIE_ARGS[@]}" --range 1 --write-metadata -D raw -f "$slug.{extension}" "$url" < /dev/null \
        || { echo "download failed for $slug, skipping"; continue; }
      for ext in jpg jpeg png webp; do [ -f "raw/$slug.$ext" ] && still="raw/$slug.$ext" && break; done
    fi
    [ -n "$still" ] || { echo "nothing landed for $slug, skipping"; continue; }
  fi

  # 540x960 H.264, no audio, N seconds, faststart so the first frame paints before the file finishes loading.
  if [ -n "$src" ]; then
    ffmpeg -y -loglevel error -ss "${skip:-0}" -i "$src" -t "$SECONDS_KEEP" -an \
      -vf "scale=540:960:force_original_aspect_ratio=increase,crop=540:960" \
      -c:v libx264 -preset slow -crf 26 -movflags +faststart "$OUT/$slug.mp4" < /dev/null
  else
    ffmpeg -y -loglevel error -loop 1 -i "$still" -t "$SECONDS_KEEP" -an \
      -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0008,1.12)':d=$((SECONDS_KEEP*25)):x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=540x960:fps=25,format=yuv420p" \
      -c:v libx264 -preset slow -crf 26 -movflags +faststart "$OUT/$slug.mp4" < /dev/null
  fi
  ffmpeg -y -loglevel error -i "$OUT/$slug.mp4" -frames:v 1 -q:v 4 "$OUT/$slug.jpg" < /dev/null
done 3< urls.tsv

# The manifest is assembled from the info.json files so nothing in a creator's name has to be escaped by hand.
python3 - "$OUT" <<'PY'
import json, sys, os
out = sys.argv[1]
rows = []
for line in open('urls.tsv', encoding='utf-8'):
    line = line.rstrip('\n')
    if not line or line.startswith('#') or '\t' not in line: continue
    slug, url = line.split('\t')[:2]
    if not os.path.exists(f'{out}/{slug}.mp4'): continue
    info = {}
    try: info = json.load(open(f'raw/{slug}.info.json', encoding='utf-8'))
    except FileNotFoundError: pass
    # An image post comes from gallery-dl, which writes <file>.json beside the still and uses its own key names.
    if not info:
        for ext in ('jpg', 'jpeg', 'png', 'webp'):
            try:
                info = json.load(open(f'raw/{slug}.{ext}.json', encoding='utf-8'))
                break
            except FileNotFoundError: continue
    handle = (info.get('uploader') or info.get('fullname') or info.get('username')
              or info.get('uploader_id') or info.get('channel') or '')
    platform = 'xhs' if ('xiaohongshu' in url or 'xhslink' in url) else 'instagram'
    rows.append({'place': slug, 'src': f'{slug}.mp4', 'poster': f'{slug}.jpg', 'platform': platform, 'credit': handle, 'source': url})
json.dump(rows, open(f'{out}/manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'wrote {out}/manifest.json ({len(rows)} clips)')
PY
du -sh "$OUT"
