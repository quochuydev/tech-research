#!/bin/bash
# Regenerates manifest.json from markdown files in researching/
# Run this script after adding new markdown files

cd "$(dirname "$0")"

echo "[" > manifest.json.tmp

first=true
for file in researching/*.md; do
  name=$(basename "$file")
  if [ "$name" != "README.md" ] && [ -f "$file" ]; then
    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> manifest.json.tmp
    fi
    printf '  { "name": "%s", "path": "%s" }' "$name" "$file" >> manifest.json.tmp
  fi
done

echo "" >> manifest.json.tmp
echo "]" >> manifest.json.tmp

mv manifest.json.tmp manifest.json

echo "manifest.json updated with $(grep -c '"name"' manifest.json) files"
