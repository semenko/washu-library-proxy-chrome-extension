/**
 * Derived from the Google Calendar Checker available at:
 * http://code.google.com/chrome/extensions/samples.html
 *
 * Licensed under the Google 3-Clause BSD:
 * http://code.google.com/google_bsd_license.html
 */


/**
 * Alias for document.getElementById.
 * @param {string} id The id of the element.
 * @return {HTMLElement} The html element for the given element id.
 */
function $(id) {
    return document.getElementById(id);
}

//adding listener when body is loaded to call init function.
window.addEventListener('load', init, false);

// Set values based on localStorage
function init() {
    parseLocalStorage();
    $('autoRedirect').checked = optAutoRedirect;
    $('enableDanforth').checked = optEnableDanforth;
    $('enableBecker').checked = optEnableBecker;
    $('preferDanforth').checked = optPreferDanforth;
    $('usageOptOut').checked = optUsageOptOut;
    buttonLogic();
}

function buttonLogic() {
    // Simple logic to force at least one proxy to be enabled
    if (!$('enableDanforth').checked) {
        $('enableBecker').checked = true;
        $('enableBecker').disabled = true;
        $('preferDanforth').checked = false;
        $('preferDanforth').disabled = true;
    } else {
        $('enableBecker').disabled = false;
    }

    if (!$('enableBecker').checked) {
        $('enableDanforth').checked = true;
        $('enableDanforth').disabled = true;
        $('preferDanforth').checked = false;
        $('preferDanforth').disabled = true;
    } else {
        $('enableDanforth').disabled = false;
    }

    // If both are enabled, allow preference
    if ($('enableDanforth').checked && $('enableBecker').checked) {
        $('preferDanforth').disabled = false;
    }

    // I don't think it's possible to get here, but just in case ...
    if (!$('enableDanforth').checked && !$('enableBecker').checked) {
        $('enableDanforth').checked = true;
        $('enableDanforth').disabled = false;
    }
}

/**
 * Saves the value of the checkbox into local storage.
 */
function save(input) {
    buttonLogic();
    localStorage.autoRedirect = $('autoRedirect').checked;
    localStorage.enableDanforth = $('enableDanforth').checked;
    localStorage.enableBecker = $('enableBecker').checked;
    localStorage.preferDanforth = $('preferDanforth').checked;
    localStorage.usageOptOut = $('usageOptOut').checked;
    // Make sure the background page sees the changes!
    chrome.extension.getBackgroundPage().parseLocalStorage();
    $('autoRedirectStatus').innerHTML = 'Saved.';
    $('autoRedirectStatus').style.display = 'block';
    setTimeout("$('autoRedirectStatus').style.display = 'none'", 1500);
}
