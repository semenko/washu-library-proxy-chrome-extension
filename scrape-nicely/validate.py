#!/usr/bin/env python
# coding: utf-8

import time
import urllib

total = 0
error = 0
for line in open('DANFORTH.txt', 'r'):
    total += 1
    line = line.rstrip()
    print line
    f = urllib.urlopen("http://%s.libproxy.wustl.edu/" % line)
    status = f.getcode()
    newurl = f.geturl()
    if (status != 200 or newurl != "https://login.libproxy.wustl.edu/login?url=http://" + line + "/"):
        print "\t** Error: %s" % line
        error += 1
    time.sleep(1)

print "Total: %s" % total
print "Errors: %s" % error
