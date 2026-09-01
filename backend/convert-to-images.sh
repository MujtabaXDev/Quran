#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p pdfs_images

normalize_page_names() {
  local dir="$1"
  for file in "$dir"/page-*.jpg; do
    [ -f "$file" ] || continue
    base=$(basename "$file" .jpg)
    num=${base#page-}

    if [[ "$num" =~ ^0+[0-9]+$ ]]; then
      normalized=$((10#$num))
      mv "$file" "$dir/page-$normalized.jpg"
    fi
  done
}

for pdf in pdfs/quran-*.pdf; do
  [ -f "$pdf" ] || continue
  name=$(basename "$pdf" .pdf)
  outdir="pdfs_images/$name"
  mkdir -p "$outdir"
  echo "Converting $pdf -> $outdir/"
  pdftoppm -jpeg -r 300 -jpegopt quality=90 "$pdf" "$outdir/page"
  normalize_page_names "$outdir"
done

echo "Done."