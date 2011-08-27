#!/bin/bash

# Input: BECKER.txt, DANFORTH.txt
#  Intermediates: BECKER-UNIQUE.txt, INTERSECT.txt, DANFORTH-UNIQUE.txt
# Output: becker-journals.js, intersect-journals.js, danforth-journals.js

grep -Fx -f DANFORTH.txt BECKER.txt > INTERSECT.txt
grep -Fxv -f DANFORTH.txt BECKER.txt > BECKER-UNIQUE.txt
grep -Fxv -f BECKER.txt DANFORTH.txt > DANFORTH-UNIQUE.txt

echo -n "var intersect_journals = {
    \"list\": ['" > intersect-journals.js
cat INTERSECT.txt | tr "\n" "," | sed "s/,/','/g" | head -c-2 >> intersect-journals.js
echo "]
};" >> intersect-journals.js


echo -n "var becker_journals = {
    \"list\": ['" > becker-journals.js
cat BECKER.txt | tr "\n" "," | sed "s/,/','/g" | head -c-2 >> becker-journals.js
echo "]
};" >> becker-journals.js


echo -n "var danforth_journals = {
    \"list\": ['" > danforth-journals.js
cat DANFORTH.txt | tr "\n" "," | sed "s/,/','/g" | head -c-2 >> danforth-journals.js
echo "]
};" >> danforth-journals.js


# Finals structure should look like:
#var intersect_journals = {
#    "list": []
#};