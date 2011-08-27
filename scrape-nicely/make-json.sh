#!/bin/bash

# Input: BECKER.txt, DANFORTH.txt
#  Intermediates: BECKER-UNIQUE.txt, INTERSECT.txt, DANFORTH-UNIQUE.txt
# Output: becker-journals.json, intersect-journals.json, danforth-journals.json

grep -Fx -f DANFORTH.txt BECKER.txt > INTERSECT.txt
grep -Fxv -f DANFORTH.txt BECKER.txt > BECKER-UNIQUE.txt
grep -Fxv -f BECKER.txt DANFORTH.txt > DANFORTH-UNIQUE.txt

echo -n "var intersect_journals = {
    \"list\": ['" > intersect-journals.json
cat INTERSECT.txt | tr "\n" "," | sed "s/,/','/g" | head -c-2 >> intersect-journals.json
echo "]
};" >> intersect-journals.json


echo -n "var becker_journals = {
    \"list\": ['" > becker-journals.json
cat BECKER.txt | tr "\n" "," | sed "s/,/','/g" | head -c-2 >> becker-journals.json
echo "]
};" >> becker-journals.json


echo -n "var danforth_journals = {
    \"list\": ['" > danforth-journals.json
cat DANFORTH.txt | tr "\n" "," | sed "s/,/','/g" | head -c-2 >> danforth-journals.json
echo "]
};" >> danforth-journals.json


# Finals structure should look like:
#var intersect_journals = {
#    "list": []
#};