#!/bin/bash
# Regenerates manifest.json from markdown files in the current directory
# Run this script after adding new markdown files

cd "$(dirname "$0")"

echo "[" > manifest.json.tmp

first=true
for file in *.md; do
  if [ "$file" != "README.md" ] && [ -f "$file" ]; then
    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> manifest.json.tmp
    fi
    printf '  { "name": "%s", "path": "%s" }' "$file" "$file" >> manifest.json.tmp
  fi
done

echo "" >> manifest.json.tmp
echo "]" >> manifest.json.tmp

mv manifest.json.tmp manifest.json

echo "manifest.json updated with $(grep -c '"name"' manifest.json) files"
