#!/usr/bin/env python
# coding: utf-8

import time
import urllib

total = 0
error = 0
for line in open('BLACKLIST.txt', 'r'):
    total += 1
    line = line.rstrip()
    print line
    f = urllib.urlopen("http://%s.beckerproxy.wustl.edu/" % line)
    status = f.getcode()
    newurl = f.geturl()
    if (status != 200 or newurl != "https://login.beckerproxy.wustl.edu/login?url=http://" + line + "/"):
        print "\t** Error: %s" % line
        error += 1
#    if (status == 200 and newurl == "https://login.libproxy.wustl.edu/login?url=http://" + line + "/"):
#        print line
    time.sleep(0.4)

print "Total: %s" % total
print "Errors: %s" % error
