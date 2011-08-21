#!/usr/bin/env python

import sys
import os

print "Content-type: text/plain\n\n"

f = open('missed-journals.log', 'a')

print >>f, os.environ['QUERY_STRING'] + "," + os.environ['REMOTE_ADDR']

print "OK"
