/**
 * Promisify loading the Google Maps API asynchronously.
 * This module ensures GMaps is only loaded once.
 * The `load()` method returns a promise which is resolved when GMaps is loaded.
 */
import $ from 'jquery';
export default gmapsAsyncLoad;

let loadingGmaps;

/**
 * Load the Google Maps API asynchronously.
 * Returns a promise which is resolved when gmaps is loaded.
 */
function gmapsAsyncLoad() {
    // if we're already loading gmaps, return the promise
    if (loadingGmaps) {
        return loadingGmaps;
    }

    var callbackName = 'onGmapsLoaded';

    /*eslint-disable new-cap */
    var loadGmaps = $.Deferred();
    /*eslint-enable new-cap */

    loadingGmaps = loadGmaps.promise();

    window[callbackName] = loadGmaps.resolve;

    var script = document.createElement('script');
    script.src =
        'https://maps.googleapis.com/maps/api/js?client=gme-fundarealestatebv&libraries=geometry&v=3&callback=' +
        callbackName;
    document.body.appendChild(script);

    return loadingGmaps;
}
