var optAutoRedirect;
var optEnableDanforth;
var optEnableBecker;
var optPreferDanforth;
var optUsageOptOut;

function parseLocalStorage() {
    optAutoRedirect = JSON.parse(localStorage.autoRedirect || true);
    optEnableDanforth = JSON.parse(localStorage.enableDanforth || true);
    optEnableBecker = JSON.parse(localStorage.enableBecker || true);
    optPreferDanforth = JSON.parse(localStorage.preferDanforth || false);
    optUsageOptOut = JSON.parse(localStorage.usageOptOut || false);
}
