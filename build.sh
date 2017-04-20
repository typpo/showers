#!/bin/bash -e
# Usage: ./build.sh vendor lib/*

pushd `dirname $0`

mkdir -p dist/

FILES=$(cat config/vendor.list config/app.list)
echo "Compressing files:"
echo $FILES

BUNDLE_NAME="bundle-$(date +%Y%m%d)-$(date +%s).js"
OUT="dist/${BUNDLE_NAME}"
./node_modules/uglify-js/bin/uglifyjs $FILES > $OUT

echo "Wrote to $OUT"
echo "Include me:"
echo "<script src=\"dist/${BUNDLE_NAME}\"></script>"

popd
