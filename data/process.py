#!/usr/bin/env python
# Example: python process_cams_data.py cams_2013.csv cams_splits/

import csv
import sys
import json

def process(f):
    reader = csv.DictReader(f, delimiter=',')
    print 'window.ORBIT_DATA=%s' % process_lines(reader)

def process_lines(lines):
    d = []
    for line in lines:
        try:
            obj = {}
            obj['a'] = float(line['a'])
            obj['e'] = float(line['e'])
            obj['i'] = float(line['i'])
            obj['w'] = float(line['w'])
            obj['q'] = float(line['q'])
            obj['om'] = float(line['Node'])
            if int(obj['a']) == 999:
                # Skip unknown semi major axes.
                continue
            d.append(obj)
        except ValueError:
            print 'Invalid line:', line
    return json.dumps(d, indent=2)

if __name__ == '__main__':
    with open(sys.argv[1]) as f:
        process(f)
