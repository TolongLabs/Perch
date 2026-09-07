# Reels

Pulls the Instagram and Xiaohongshu clips that play on the swipe cards, cuts each to a short muted vertical loop, and
writes a manifest the frontend reads. **Nothing here ships to a user**; the clips are demo assets for a prototype.

**These are other people's videos.** Every clip is credited on the card with the creator's handle and links back to the
post. The media itself is never committed: it lives in a bucket, and `raw/`, `out/` and `cookies.txt` are ignored.

## Tools

System `yt-dlp` and `ffmpeg`, and `gcloud` for the upload. Nothing is added to `package.json`.

## Steps

1. **Export cookies if needed.** Public Instagram reels fetch anonymously; Xiaohongshu and throttled fetches need them.
   In the browser you are logged into, install a cookies.txt exporter (for example "Get cookies.txt LOCALLY"), open
   instagram.com and export to `cookies.txt` in this folder, then do the same on xiaohongshu.com and append. Under WSL
   the Windows browser's cookie store is encrypted, so `--cookies-from-browser` does not work; the export does
2. **List the reels** in `urls.tsv`, one per card, slug first. The slug is the place id in `v2/src/data/places.ts`
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
- **Instagram returns a low-res file**: add `--cookies` from a logged-in session; anonymous fetches get the preview
  rendition
