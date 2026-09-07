# Reels

Pulls the Instagram and Xiaohongshu clips that play on the swipe cards, cuts each to a short muted vertical loop, and
writes a manifest the frontend reads. **Nothing here ships to a user**; the clips are demo assets for a prototype.

**These are other people's videos.** Every clip is credited on the card with the creator's handle and links back to the
post. The media itself is never committed: it lives in a bucket, and `raw/`, `out/` and `cookies.txt` are ignored.

## Tools

System `yt-dlp` and `ffmpeg`, `gallery-dl` through `uvx` for image posts, and `gcloud` for the upload. Nothing is added
to `package.json`.

**What makes a good card.** Vertical, the place itself in the first second, no caption banner, no person filling the
frame. Judge the cover before the caption: a swipe is decided on instinct in under two seconds, and a still that shows
the place beats a reel that shows a presenter.

## Steps

1. **Export cookies if needed.** Public Instagram reels fetch anonymously; Xiaohongshu and throttled fetches need them.
   In the browser you are logged into, install a cookies.txt exporter (for example "Get cookies.txt LOCALLY"), open
   instagram.com and export to `cookies.txt` in this folder, then do the same on xiaohongshu.com and append. Under WSL
   the Windows browser's cookie store is encrypted, so `--cookies-from-browser` does not work; the export does
2. **List the posts** in `urls.tsv`, one per card, slug first. The slug is the place id in `v2/src/data/places.ts`. A
   reel or an image post both work: an image becomes an eight second slow zoom at the same size, so the card never
   branches. An optional third column skips that many seconds at the start of a reel, for one that opens on a title card
   or a black frame
3. **Run it:** `./fetch.sh`. Set `SECONDS_KEEP=10` to change the clip length. Output lands in `out/`, about 1 MB a clip
4. **Upload:**

```bash
gcloud storage buckets create gs://perch-reels --project codenection-2026 --location asia-southeast1 --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding gs://perch-reels --member allUsers --role roles/storage.objectViewer
gcloud storage cp -r out/* gs://perch-reels/
```

Files are then served at `https://storage.googleapis.com/perch-reels/<slug>.mp4`, no CORS setup needed for a `<video>`
tag. Copy `out/manifest.json` to `v2/src/data/reels.json` and set the base URL there.

## If Something Breaks

- **`login required` or a 429**: cookies are stale or the account is rate-limited. Re-export, wait, and use a spare
  account rather than a main one
- **A Xiaohongshu note downloads only images**: it was a photo post, not a video. Pick a different note
- **A Xiaohongshu clip comes out as a narrow slice**: the note was landscape and the crop kept the middle. Most of its
  video notes are, and most carry a caption banner, which is why the shipped set is Instagram only
- **The credit field is empty**: yt-dlp reports `NA` as the uploader for Xiaohongshu notes. Fill it by hand from the
  note page before committing the manifest
- **Instagram returns a low-res file**: add `--cookies` from a logged-in session; anonymous fetches get the preview
  rendition
