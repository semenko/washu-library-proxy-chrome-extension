#!/bin/bash

# First let's scrape Becker

for x in {A..Z}
do
    curl "http://fq5np7af6j.search.serialssolutions.com/?L=FQ5NP7AF6J&V=1.0&tab=ALL&N=1000&S=T_AZ&C=$x" >> becker-raw.html
    sleep 5
done

# Get the "Next" page too.

for x in {A..Z}
do
    curl "http://fq5np7af6j.search.serialssolutions.com/?V=1.0&L=FQ5NP7AF6J&S=T_AZ&C=$x&tab=ALL&N=1000&B=1000" >> becker-raw.html
    sleep 5
done


grep -v "Open" becker-raw.html | grep -oE "U=http[^\"]+" | grep -oE "%3A%2F%2F.*" | grep -oE "^%3A%2F%2F[^%]+" | cut -b10- | uniq > scraped-journals.txt


# Let's do danforth, too

curl "http://je5qh2yg7p.search.serialssolutions.com/" >> danforth-raw.html

grep -iv "open" danforth-raw.html | grep "libproxy" | grep -oE "U=http[^\"]+" | grep -oE "%3A%2F%2F.*" | grep -oE "^%3A%2F%2F[^%]+" | cut -b10- | uniq >> scraped-journals.txt
grep -iv "open" danforth-raw.html | grep "libproxy" | grep -oE "url%3Dhttp[^\"]+" | grep -oE "%3A%2F%2F.*" | grep -oE "^%3A%2F%2F[^%]+" | cut -b10- | uniq >> scraped-journals.txt

# Add in whitelists, make lowercase, remove duplicates
cat scraped-journals.txt > all-journals-pre-unique.txt
cat whitelist.txt >> all-journals-pre-unique.txt
sort all-journals-pre-unique.txt | tr "[A-Z]" "[a-z]" | uniq | grep -v -f blacklist.txt > all-journals.txt

wc -l all-journals.txt
