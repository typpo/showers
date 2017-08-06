#!/bin/bash -e

pushd `dirname $0` &> /dev/null
cd "$(git rev-parse --show-toplevel)"
mkdir -p /var/log/showers

echo "starting @ `date`"

# node
export NODE_ENV=production
supervisor showers.js 2>> /var/log/showers/node.err.log 1>> /var/log/showers/node.out.log &

for job in `jobs -p`
do
echo $job
  wait $job
done

popd &> /dev/null
