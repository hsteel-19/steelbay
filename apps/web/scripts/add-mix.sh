#!/usr/bin/env bash
#
# Add a mix to /music: encode, measure, upload, and print the manifest row.
#
#   ./scripts/add-mix.sh <slug> <path/to/master.wav> <path/to/cover.png>
#
# Run from apps/web. The source WAV never leaves your machine — only the AAC
# copy is uploaded, because a two-hour WAV is 1.2GB and nobody streams that.
set -euo pipefail

slug=${1:-}; wav=${2:-}; cover=${3:-}
if [[ -z $slug || -z $wav || -z $cover ]]; then
  echo "usage: ./scripts/add-mix.sh <slug> <master.wav> <cover.png>" >&2
  exit 1
fi
[[ -f $wav ]]   || { echo "no such wav: $wav" >&2; exit 1; }
[[ -f $cover ]] || { echo "no such cover: $cover" >&2; exit 1; }

# SUPABASE_URL / SUPABASE_SERVICE_KEY
set -a; . .env.local; set +a

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "→ encoding 128k AAC (faststart, so it seeks before it finishes downloading)"
afconvert "$wav" -o "$tmp/$slug.m4a" -f m4af -d aac -b 128000 -s 2 -q 127

echo "→ waveform from the master"
node scripts/mix-peaks.mjs "$wav" "$slug"

echo "→ cover to 800px jpeg"
mkdir -p public/mixes
sips -s format jpeg -s formatOptions 82 -Z 800 "$cover" --out "public/mixes/$slug.jpg" >/dev/null

echo "→ uploading $(du -h "$tmp/$slug.m4a" | cut -f1) to supabase storage"
# -X PUT rather than POST so re-running replaces an existing object instead of
# failing on a duplicate key.
code=$(curl -s -o "$tmp/resp" -w '%{http_code}' -X PUT \
  "$SUPABASE_URL/storage/v1/object/mixes/$slug.m4a" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: audio/mp4" \
  -H "Cache-Control: max-age=31536000" \
  --data-binary "@$tmp/$slug.m4a")
if [[ $code != 200 ]]; then
  echo "upload failed (HTTP $code): $(cat "$tmp/resp")" >&2
  echo "a 413 means Supabase's upload size limit is below the file size —" >&2
  echo "raise it under Project Settings → Storage." >&2
  exit 1
fi

duration=$(afinfo "$wav" | awk '/estimated duration/ {printf "%d", $3}')
recorded=$(stat -f '%Sm' -t '%Y-%m-%d' "$wav")
echo
echo "done. add this to lib/mixes.ts:"
echo
cat <<ROW
  {
    slug: '$slug',
    title: 'TITLE',
    recorded: '$recorded',
    duration: $duration,
  },
ROW
echo
echo "(recorded is the master's timestamp — correct it if that is not the gig date)"
echo "(to feature it, add '$slug' to FEATURED in lib/mixes.ts)"
