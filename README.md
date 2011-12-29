# WashU Library Chrome Extension

Install the extension for Chrome at [the Chrome Web Store](https://chrome.google.com/webstore/detail/amamhphjnhlgdpjhfmnkikcingjfoeao).

## Overview

This is a Chrome extension that automatically rewrites journal URLs to include
the WashU library proxies (both Danforth and Becker proxies).

These proxies are:

 * https://beckerproxy.wustl.edu
 * https://login.libproxy.wustl.edu

e.g. nature.com would become: nature.com.beckerproxy.wustl.edu OR nature.com.libproxy.wustl.edu


NOTE: This extension requires either a WUSTL Key or a Becker Proxy account.

## Options

 * Auto Redirect (default: true)
  * Should we automatically redirect the page if it's in a database of known journals ([LIB]-journals.js)?
 * Enable Danforth Proxy (default: true)
  * Should we use libproxy.wustl.edu?
 * Enable Becker Proxy (default: true)
  * Should we use beckerproxy.wustl.edu (or beckerproxy2a.wucon.wustl.edu)?
 * Prefer Danforth Proxy (default: false)
  * If a journal is in both proxies (e.g. Nature) and both are enabled, should we prefer Danforth?


## Authors
**Nick Semenkovich**

+ https://github.com/semenko/
+ http://web.mit.edu/semenko/

## License
Copyright 2011-2012, Nick Semenkovich <semenko@alum.mit.edu>

Released under the MIT License. See LICENSE for details.

Some content (e.g. options.html) is licensed under the Google BSD 3-Clause License:
http://code.google.com/google_bsd_license.html
