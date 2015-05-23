These scripts pull down a copy of journals listed publicly at the Becker and Danforth sites.

Run them intermittently (every ~month?) to reflect changes in available journals.

They're parsed into:

+ becker.txt
+ danforth.txt
+ intersect.txt

and then written to ../javascript/journals.json.

There's a whitelist of journals that sometimes fall off the Becker & Danforth lists.


There's also a blacklist of journals that /shouldn't/ be redirected.

For example:

+ nih.gov (This is all public)
+ PLoS Journals (These are all open-access Creative Commons)

## How to Run
1. ./scrape.sh (gently crawl the public Becker & Danforth collection websites for journal URLs)
2. ./validate-and-split.py (test those URLs actually work at Becker, Danforth, or both)
3. ./make-json.sh (generate the .json shipped with the extension)
