#!/usr/bin/env bash
# Convert gallery images (foto-N.jpg) to responsive WebP at three sizes.
# Thumbnail  800w  q78  — grid view
# Medium    1200w q82  — mobile lightbox
# Large     2000w q85  — desktop lightbox
# Original JPGs are kept as fallback for <picture> elements.
set -euo pipefail

PUBLIC_DIR="${PUBLIC_DIR:-public}"
SIZES=(800 1200 2000)
QUALITIES=(78 82 85)

count=0
total_bytes=0

for jpg in "$PUBLIC_DIR"/foto-*.jpg; do
  [[ -f "$jpg" ]] || continue
  base=$(basename "$jpg" .jpg)
  for i in "${!SIZES[@]}"; do
    w="${SIZES[$i]}"
    q="${QUALITIES[$i]}"
    out="$PUBLIC_DIR/${base}-${w}.webp"
    magick "$jpg" -resize "${w}x" -quality "$q" "$out"
    sz=$(stat -c%s "$out")
    if [[ "$w" == "800" ]]; then
      total_bytes=$((total_bytes + sz))
      count=$((count + 1))
    fi
    printf '  %-28s %6d KB\n' "${base}-${w}.webp" "$((sz / 1024))"
  done
done

if [[ "$count" -eq 0 ]]; then
  echo "No foto-*.jpg files found in $PUBLIC_DIR. Add gallery photos first." >&2
  exit 1
fi

mb=$(awk "BEGIN{printf \"%.2f\", $total_bytes / 1048576}")
echo "---"
echo "Thumbnails generated: $count"
echo "Total thumbnail payload: ${mb} MB"
if awk "BEGIN{exit !($total_bytes > 8388608)}"; then
  echo "WARNING: thumbnail payload exceeds 8MB target" >&2
fi
