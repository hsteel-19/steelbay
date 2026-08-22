#!/usr/bin/env bash
#
# Add a shot to the /music live gallery.
#
#   ./scripts/add-photo.sh <slug> <path/to/photo.jpg>
#
# Run from apps/web. Aspect ratio is preserved deliberately: the library is a
# mix of 9:16 gig posters and 3:2 photos, and a square centre-crop took the
# venue and the date straight off the top and bottom of the posters. The
# gallery lays them out in CSS columns, which copes with mixed shapes.
set -euo pipefail

slug=${1:-}; src=${2:-}
if [[ -z $slug || -z $src ]]; then
  echo "usage: ./scripts/add-photo.sh <slug> <photo.jpg>" >&2
  exit 1
fi
[[ -f $src ]] || { echo "no such file: $src" >&2; exit 1; }

mkdir -p public/live
sips -s format jpeg -s formatOptions 80 -Z 700 "$src" --out "public/live/$slug.jpg" >/dev/null

dims=$(sips -g pixelWidth -g pixelHeight "public/live/$slug.jpg" \
  | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}')
echo "public/live/$slug.jpg  ($dims, $(du -h "public/live/$slug.jpg" | cut -f1))"
