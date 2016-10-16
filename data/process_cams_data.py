#!/usr/bin/env python
# Splits CAMS database into files by IAU number.

import csv
import json
import os
import random
import sys
from collections import defaultdict

from process import process_lines

def process(f, output_dir):
    reader = csv.DictReader(f, delimiter=',')
    d = defaultdict(list)
    counts = defaultdict(int)
    line_count = 0
    for line in reader:
        iau_num = line['IAU#']
        d[iau_num].append(line)
        counts[iau_num] += 1
        line_count += 1
        if line_count % 10000 == 0:
            print line_count, '...'

    for iau_num, data in d.iteritems():
        if len(data) > 10000:
            # Downsample to 10k data points
            random.shuffle(data)
        processed_json = process_lines(data[:10000])
        with open(os.path.join(output_dir, 'iau_%s.json' % iau_num), 'w') as shower_file:
            shower_file.write(processed_json)

    print json.dumps(counts, indent=2)
    print len(counts), 'total'

if __name__ == '__main__':
    with open(sys.argv[1]) as f:
        process(f, sys.argv[2])
