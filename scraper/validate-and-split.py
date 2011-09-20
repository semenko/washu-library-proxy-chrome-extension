#!/usr/bin/env python
# coding: utf-8

# We don't trust anything Becker/Danforth says. Explicitly validate the URLs
# by trying to connect to both proxies, then build:
# becker.txt
# danforth.txt
# intersect.txt

import time
import urllib

fintersect = open('intersect.txt', 'w')
fbecker = open('becker.txt', 'w')
fdanforth = open('danforth.txt', 'w')

for line in open('all-journals.txt', 'r'):
    line = line.rstrip()
    print line

    becker = True
    danforth = True

    # Check Decker
    b = urllib.urlopen("http://%s.beckerproxy.wustl.edu/" % line)
    if (b.getcode() != 200 or b.geturl() != "https://login.beckerproxy.wustl.edu/login?url=http://" + line + "/"):
        becker = False

    # Check Danforth
    d = urllib.urlopen("http://%s.libproxy.wustl.edu/" % line)
    if (d.getcode() != 200 or d.geturl() != "https://login.libproxy.wustl.edu/login?url=http://" + line + "/"):
        danforth = False

    # Write output
    if becker and danforth:
        print >>fintersect, line
    elif danforth:
        print >>fdanforth, line
    elif becker:
        print >>fbecker, line
    else:
        print "Error: No access to %s" % line

    time.sleep(0.2)
