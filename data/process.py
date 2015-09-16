#!/usr/bin/env python

import csv
import sys
import json

def process(f):
    reader = csv.DictReader(f, delimiter=',')
    d = []
    for line in reader:
        obj = {}
        obj['a'] = line['a']
        obj['e'] = line['e']
        obj['i'] = line['i']
        obj['w'] = line['w']
        obj['q'] = line['q']
        obj['om'] = line['Node']
        d.append(obj)
    print 'window.ORBIT_DATA=',
    print json.dumps(d, indent=2)


if __name__ == '__main__':
    with open(sys.argv[1]) as f:
        process(f)
