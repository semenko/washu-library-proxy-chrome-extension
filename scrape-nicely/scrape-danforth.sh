#!/bin/bash

# This is much easier ...

curl "http://je5qh2yg7p.search.serialssolutions.com/" >> danforth-raw.html

grep -oE "U=http[^\"]+" danforth-raw.html | grep -oE "%3A%2F%2F.*" | grep -oE "^%3A%2F%2F[^%]+" | cut -b10- > danforth-pre-unique.txt
grep -oE "url%3Dhttp[^\"]+" danforth-raw.html | grep -oE "%3A%2F%2F.*" | grep -oE "^%3A%2F%2F[^%]+" | cut -b10- >> danforth-pre-unique.txt
wc -l danforth-pre-unique.txt
sort danforth-pre-unique.txt | tr "[A-Z]" "[a-z]" | uniq > DANFORTH.txt
wc -l DANFORTH.txt
