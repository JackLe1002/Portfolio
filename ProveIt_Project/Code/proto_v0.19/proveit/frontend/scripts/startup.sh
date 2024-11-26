#!/bin/sh

BUILD_DIR="/usr/src/app/dist/assets"

PLACEHOLDER="\${VITE_SERVER}"
NEW_VALUE=$VITE_SERVER

for file in $BUILD_DIR/index-*.js; do
  if [[ -f "$file" ]]; then
    echo "Replacing in $file"
    sed -i "s|$PLACEHOLDER|$NEW_VALUE|g" "$file"
  fi
done

serve -l 8080 --single /usr/src/app/dist
