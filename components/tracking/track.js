import mergeWith from 'lodash/mergeWith';
import Logger from '../logger/logger';
import AppCookie from '../app-utils/app-utils-cookies';

const ADSDETECT_ID = 'krnomhVATBFQ';

const getGlobalProperties = () => {
    const element = document.querySelector('[data-tracking-global-properties]');

    if (element === null) return {};

    return JSON.parse(element.innerHTML);
};

const getAllPropertiesOnPage = () => {
    const elements = document.querySelectorAll('[data-tracking-properties]');

    if (elements.length === 0) return {};

    let data = {};

    elements.forEach(el => {
        data = mergeWith(data, JSON.parse(el.innerHTML), (objValue, srcValue) =>
            Array.isArray(objValue) ? objValue.concat(srcValue) : objValue
        );
    });

    return data;
};

const personalisationCookieAccepted = () => {
    const cookieConsent = AppCookie.getCookie('OptanonConsent');

    if (!cookieConsent) return false;

    const cookieConsentGroup = cookieConsent
        .split('&')
        .map(i => i.split('='))
        .filter(v => v[0] === 'groups')[0][1];

    if (!cookieConsentGroup) return false;

    const cookieConsentSplitted = decodeURIComponent(cookieConsentGroup).split(
        ','
    ); //groups=F01:1,F02:1,F03:0,F05:0
    const personalisationCookie = cookieConsentSplitted[2].split(':');
    return personalisationCookie[1] === '1';
};

const adblockerDetected = () => !document.getElementById(ADSDETECT_ID);

/**
 * Send event tracking to Segment
 * [https://segment.com/docs/connections/spec/track/]
 *
 * @param  {String} event (Required) The event name passed should come from the list in ./events.js
 * @param  {Object} props (Optional) The props that need to be sent along the event
 * @param  {Boolean} excludePageProperties (Optional) If true, only global properties will be included (site, site_locale, etc.)
 * @param  {Object} analytics (Optional) When empty, it will take window.analytics object
 * @param  {Object} globalProperties (Optional) When empty, it will get the data from the JSON specified in the head of the DOM (data-tracking-global-properties)
 * @param  {Object} pageProperties (Optional) When empty, it will get the data from the JSON specified in the DOM (data-tracking-properties)
 */
export default (
    event,
    props,
    excludePageProperties,
    analytics,
    globalProperties,
    pageProperties
) => {
    analytics = analytics || window.analytics;
    props = props || {};

    if (typeof analytics === 'undefined') {
        // only log error for unintentional behaviour
        if (personalisationCookieAccepted() && !adblockerDetected()) {
            Logger.log(
                `Segment is not loaded when executing "${event}" event`,
                {
                    eventKey: event,
                    function: 'track',
                }
            );
        }

        return;
    }

    if (!event) {
        Logger.log('Event is empty', {
            function: 'track',
        });

        return;
    }

    globalProperties = globalProperties || getGlobalProperties();

    if (!excludePageProperties) {
        pageProperties = pageProperties || getAllPropertiesOnPage();
    }

    const mergedProps = {
        ...globalProperties,
        ...(pageProperties || {}),
        ...props,
    };

    analytics.track(event, mergedProps);
};
