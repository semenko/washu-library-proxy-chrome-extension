#!/bin/bash

for x in {A..Z}
do
    curl "http://fq5np7af6j.search.serialssolutions.com/?L=FQ5NP7AF6J&V=1.0&tab=ALL&N=1000&S=T_AZ&C=$x" >> becker-raw.html
    sleep 10
done

# Get the "Next" page too.

for x in {A..Z}
do
    curl "http://fq5np7af6j.search.serialssolutions.com/?V=1.0&L=FQ5NP7AF6J&S=T_AZ&C=$x&tab=ALL&N=1000&B=1000" >> becker-raw.html
    sleep 10
done


grep -oE "U=http[^\"]+" becker-raw.html | grep -oE "%3A%2F%2F.*" | grep -oE "^%3A%2F%2F[^%]+" | cut -b10- > becker-pre-unique.txt
wc -l becker-pre-unique.txt
sort becker-pre-unique.txt | uniq > BECKER-UNIQUE.txt
wc -l BECKER-UNIQUE.txt
