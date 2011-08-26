/**
 * Derived from the Google Calendar Checker available at:
 * http://code.google.com/chrome/extensions/samples.html
 * 
 * Licensed under the Google 3-Clause BSD:
 * http://code.google.com/google_bsd_license.html
 */

var isMultiCalendar;

var optAutoRedirect;
var optUseBecker;
var optNoUsage;

/**
 * Alias for document.getElementById.
 * @param {string} id The id of the element.
 * @return {HTMLElement} The html element for the given element id.
 */
function $(id) {
    return document.getElementById(id);
};

//adding listener when body is loaded to call init function.
window.addEventListener('load', init, false);

// Set values based on localStorage
function init() {
  optAutoRedirect = JSON.parse(localStorage.autoRedirect || false);
  $('autoRedirect').checked = isMultiCalendar;
//  $('autoRedirectText').innerHTML =
//      chrome.i18n.getMessage('autoRedirectText');
//  $('optionsTitle').innerHTML = chrome.i18n.getMessage('optionsTitle');
//  $('imageTooltip').title = chrome.i18n.getMessage('imageTooltip');
//  $('imageTooltip').alt = chrome.i18n.getMessage('imageTooltip');
//  $('autoRedirectText').title = chrome.i18n.getMessage('autoRedirectToolTip');
//  $('autoRedirect').title = chrome.i18n.getMessage('autoRedirectToolTip');
//  $('extensionName').innerHTML = chrome.i18n.getMessage('extensionName');
};

/**
 * Saves the value of the checkbox into local storage.
 */
function save() {
  var autoRedirectId = $('autoRedirect');
  localStorage.autoRedirect = autoRedirectId.checked;
//  if (autoRedirectId) {
//    autoRedirect.disabled = true;
//  }
  $('status').innerHTML = 'Saving ...';
  $('status').style.display = 'block';
//  chrome.extension.getBackgroundPage().onSettingsChange();
};

/**
 * Fired when a request is sent from either an extension process or a content
 * script. Add Listener to enable the save checkbox button on server response.
 * @param {String} request Request sent by the calling script.
 * @param {Object} sender Information about the script that sent a message or
 *     request.
 * @param {Function} sendResponse Function to call when there is a response.
 *     The argument should be any JSON-ifiable object, or undefined if there
 *     is no response.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (!request.message)
    return;
  switch (request.message) {
    case 'enableSave':
      if ($('autoRedirect')) {
        if ($('autoRedirect').disabled) {
            $('status').innerHTML = 'OMGSAVED';
          $('status').style.display = 'block';
          setTimeout("$('status').style.display = 'none'", 1500);
        }
        $('autoRedirect').disabled = false;
      }
      sendResponse();
      break;
  }
});
