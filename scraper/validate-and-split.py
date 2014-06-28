#!/usr/bin/env python
# coding: utf-8

# We don't trust anything Becker/Danforth says. Explicitly validate the URLs
# by trying to connect to both proxies, then build:
# becker.txt
# danforth.txt
# intersect.txt

import time
import urllib

raw_input("Press Enter to continue...")

fintersect = open('intersect.txt', 'w')
fbecker = open('becker.txt', 'w')
fdanforth = open('danforth.txt', 'w')

for line in open('all-journals.txt', 'r'):
    line = line.rstrip()
    print line

    becker = True
    danforth = True

    # Check Becker
    failed = True
    while failed:
        try:
            b = urllib.urlopen("http://%s.beckerproxy.wustl.edu/" % line)
            failed = False
        except IOError:
            print("Failure! %s" % line)
            time.sleep(0.1)
        
    if (b.getcode() != 200 or b.geturl() != "https://login.beckerproxy.wustl.edu/login?url=http://" + line + "/"):
        becker = False

    # Check Danforth
    failed = True
    while failed:
        try:
            d = urllib.urlopen("http://%s.libproxy.wustl.edu/" % line)
            failed = False
        except IOError:
            print("Failure! %s" % line)
            time.sleep(0.1)

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

    time.sleep(0.05)
