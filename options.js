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
}

/**
 * Saves the value of the checkbox into local storage.
 */
function save(input) {
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
