These scripts pull down a copy of journals listed publicly at the Becker and Danforth sites.

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
