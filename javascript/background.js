// Parse some local storage objects!
// onNetwork now comes from an LSO
parseLocalStorage();

var danforthProxyURL = '.libproxy.wustl.edu';
var beckerProxyURL = '.beckerproxy.wustl.edu';

// Once per session, append "?holding=wustlmlib" to PubMed.
var rewrotePubMedThisSession = false;

// For debugging & options page
var networkTag = '';

// Set a 15 minute timeout interval to redetect the network status.
// Per poissoncdf(), this is probably friendly. Hell, MSVPN is way more active.
var refreshTimeoutHandle;
var refreshTimeoutMilliseconds = 900000;

// Are we at WashU? SLCH? WUSM? Off campus!?!
// TODO: At start, guess state from last session. If we're restoring lots of closed tabs on campus at restart, we might incorrectly assume off-campus.
function detectNetworkState() {
    // This will pass an HTTP_ORIGIN flag with the Chrome Extension ID so Becker
    // can contact me or block the extension if it causes any problems.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://becker.wustl.edu/sites/all/themes/bml_theme2/js/network-indicator-script3.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var resp = JSON.parse(xhr.responseText.substring(1, xhr.responseText.length - 1));
                if (resp.networkTag == "WUSTL" || resp.networkTag == "WUSM") {
                    onNetwork = true;
                    localStorage.onNetwork = true; // I don't quite trust the LSO API yet, which is why we have this duplication.
                    beckerProxyURL = '.beckerproxy.wustl.edu';
                    networkTag = resp.networkTag;
                } else if (resp.networkTag == "SLCH" || resp.networkTag == "BJH" || resp.networkTag == "BJC") {
                    onNetwork = false; // I think most of these networks have ~zero journals available.
                    localStorage.onNetwork = false;
                    beckerProxyURL = '.beckerproxy.wucon.wustl.edu';
                    networkTag = resp.networkTag;
                } else if (resp.networkTag == "OFF") {
                    onNetwork = false;
                    localStorage.onNetwork = false;
                    beckerProxyURL = '.beckerproxy.wustl.edu';
                    networkTag = resp.networkTag;
                } else {
                    // Something weird happened. We don't update onNetwork, since this could be
                    // a timed redetection that failed, so we'll preserve the previous state.
                    console.warn('Error: Unknown response from Becker:' + resp.networkTag);
                    writeToRemoteLog('Becker-Unknown-Response_' + resp.networkTag);
                    setTimeout(function(){ detectNetworkState(); }, 15000);
                }
                console.info('Detection event: onNetwork: ' + onNetwork + ', networkTag: ' + resp.networkTag);
                clearTimeout(refreshTimeoutHandle);
                refreshTimeoutHandle = setTimeout(function(){ detectNetworkState(); }, refreshTimeoutMilliseconds);
            } else {
                // Becker XHR returned status != 200. Maybe a network error?
                console.warn('Error from Becker: Retrying in 15s.');
                setTimeout(function(){ detectNetworkState(); }, 15000);
            }
        }
    };
    xhr.send();
}
detectNetworkState();

// Listener for the options page
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.operation == 'getstate') {
            sendResponse({networkTag: networkTag});
        } else if (request.operation == 'redetect') {
            console.info('Manual network redetection.');
            detectNetworkState();
            sendResponse({networkTag: networkTag});
        } else {
            console.warn('Unknown background listener request.');
            sendResponse({});
        }
    });


// The user wants auto-redirection and is off-network,
// so we perform URL parsing and (maybe) redirection
function checkURLforRedirection(tabId, parsedURL) {
    if (intersect_journals.hasOwnProperty(parsedURL.host)) {
        if (optPreferDanforth || (optEnableDanforth && !optEnableBecker)) {
            doRedirectToProxy(tabId, parsedURL, danforthProxyURL);
            return true;
        } else {
            doRedirectToProxy(tabId, parsedURL, beckerProxyURL);
            return true;
        }
    }

    // We're still here, so the journal is not in intersect_journals.
    if (optEnableDanforth) {
        if (danforth_journals.hasOwnProperty(parsedURL.host)) {
            doRedirectToProxy(tabId, parsedURL, danforthProxyURL);
            return true;
        }
    }
    if (optEnableBecker) {
        if (becker_journals.hasOwnProperty(parsedURL.host)) {
            doRedirectToProxy(tabId, parsedURL, beckerProxyURL);
            return true;
        }
    }
    return false;
}

// Redirect the page using the auto-determined proxy URL
// Modularize so we only parse the URL once (parsing is expensive!)
function doRedirectToProxy(tabId, parsed, proxyURL, appendString) {
    if (!appendString) {
        appendString = '';
    }
    var proxifiedURL = parsed.protocol + "://" + parsed.host + proxyURL + parsed.relative + appendString;
    try {
        chrome.tabs.update(tabId, {url: proxifiedURL});
    } catch(e) {
        // Pre-rendered magic tab that we can't update.
    }
}

// Send log data if there's a missed URL (someone had to manually click)
// or there's a Becker network detection error.
function writeToRemoteLog(theData) {
    var uploader = new XMLHttpRequest();
    var logString = "url:" + encodeURIComponent(theData) + ",auto:" + optAutoRedirect +
        ",onNet:" + onNetwork + ",tag:" + networkTag;
    uploader.open("GET", "https://update.epoxate.com/becker-extension/log.py?" + logString, true);
    uploader.send();
}

// Listen for pending URL loads
// WARNING: Pre-rendered tabs from URL prediction (or link hints) cause oddities with onBeforeNavigate,
//          like inaccessible tabs. Be careful here!
function checkNavObject(frameId, tabId, url) {
    // Only listen in the main frame at frameId=0
    // Should we check for redirect loops, like with web.mit.edu?
    // frameId will match "0" for webNavigation object, and "Undefined" for tabs
    if (optAutoRedirect && frameId === 0) {
        var parsedURL = parseUri(url);
        if (optEnableBecker && parsedURL.host == "www.ncbi.nlm.nih.gov") {
            // Redirect PubMed journals to add ?holding flag.
            // This is useful whether we are on or off network.
            // TODO: Redirect for PMC articles, too?
            if (!rewrotePubMedThisSession) {
                if (parsedURL.relative == "/pubmed/" || parsedURL.relative == "/pubmed"
                    || parsedURL.relative == "/pmc/" || parsedURL.relative.match(/^\/pubmed\/\d{6,}$/)) {
                    // Redirect with no proxy url, but an appendString
                    doRedirectToProxy(tabId, parsedURL, "", "?holding=wustlmlib");
                    rewrotePubMedThisSession = true;
                    setTimeout(function(){ rewrotePubMedThisSession = false; }, 7200000); // Re-do this every 2 hours.
                }
            }
        }  else if (!onNetwork) {
            checkURLforRedirection(tabId, parsedURL);
        }
    }
}

chrome.webNavigation.onBeforeNavigate.addListener(function(navObject) {
    checkNavObject(navObject.frameId, navObject.tabId, navObject.url); } );
chrome.tabs.onCreated.addListener(function(navObject) {
    checkNavObject(0, navObject.id, navObject.url); } );
// Deal with pre-rendered tabs.
chrome.webNavigation.onTabReplaced.addListener(function(navObject) {
    chrome.tabs.get(navObject.tabId, function(tab) {
        checkNavObject(0, navObject.id, tab.url);
    }); });

// Alert users if they're trying to unnecessarily proxify things.
function showUserHint(warning) {
    chrome.notifications.create(
        'note',
        {   type: 'basic',
            iconUrl: '../images/schollidesign48.png',
            title: 'Unnecessary Click',
            message: warning
        },
        function(noteId) { setTimeout(function(){ chrome.notifications.clear(noteId, function() {}) }, 8000); }
    );
}

// Listen to clicking on our button.
chrome.browserAction.onClicked.addListener(function (tab) {
    // Parse and redirect.
    var parsedURL = parseUri(tab.url);

    // We check for HTTP/HTTPS only (no chrome://), and that "proxy.wustl.edu" isn't at the end of the
    // string, otherwise we're probably already at [becker|lib]proxy.wustl.edu.
    if (parsedURL.protocol == 'http' || parsedURL.protocol == 'https') {
        if (parsedURL.host.substring(parsedURL.host.length - 15) != 'proxy.wustl.edu') {
            if (hint_urls.hasOwnProperty(parsedURL.host)) {
                // Warn users if they're doing something unnecessary.
                // In this case, do NOT redirect these URLs.
                showUserHint(hint_urls[parsedURL.host]);
            } else {
                // Warn on-network redirects, but don't block them
                if (onNetwork) {
                    showUserHint('You\'re on a BJC/WashU network, so you probably don\'t need a proxy.');
                }
                // TODO: Handle Danforth differently, since they don't seem to like SSL as much.
                // TODO: Consider dropping HTTPS support? Is this useful?
                if (parsedURL.protocol == 'https') {
                    parsedURL.host = parsedURL.host.replace(/\./g, '-');
                }
                if (optPreferDanforth || (!optEnableBecker && optEnableDanforth)) {
                    doRedirectToProxy(tab.id, parsedURL, danforthProxyURL);
                } else {
                    doRedirectToProxy(tab.id, parsedURL, beckerProxyURL);
                }
            }
        } else {
            // User clicked even though we're already proxified
            showUserHint('Looks like you\'re already using the proxy. No need to click again!');
        }
    } else {
        showUserHint('This extension only works on websites starting with http:// or https://');
    }

    // If we've been manually clicked (and auto-triggering is enabled), the journal
    // is missing from our list. Let's send the journal URL to the cloud logger.
    // We log non-http/https here in case we're missing something (ftp sites for journal data?)
    if (!tab.incognito && !optUsageOptOut) {
        writeToRemoteLog(parsedURL.host);
    }
});
