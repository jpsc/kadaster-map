/**
 * Cookie utility. The code is based on http://www.w3schools.com/js/js_cookies.asp
 */
export default (() => {
    let publics = {};

    /**
     * @param {string} cookieName
     * @param {*} cookieValue
     * @param {int} [expirationDays] Number of days to expire the cookie. Default is 365 days.
     * @param {string} [path] - Cookie path. Default is root '/'.
     */
    publics.setCookie = function(
        cookieName,
        cookieValue,
        expirationDays,
        path
    ) {
        if (typeof expirationDays === 'undefined') {
            expirationDays = 365;
        }
        if (typeof path === 'undefined') {
            path = '/';
        }
        const expirationDate = new Date();
        const dayInMilliseconds = 86400000; // 24*60*60*1000
        expirationDate.setTime(
            expirationDate.getTime() + expirationDays * dayInMilliseconds
        );
        document.cookie =
            cookieName +
            '=' +
            cookieValue +
            ';expires=' +
            expirationDate.toUTCString() +
            ';path=' +
            path;
    };

    /**
     * @param {string} cookieName Cookie name.
     * @param {*} [defaultValue] If cookie is not found, returns this value. If not defined, returns undefined.
     * @returns {*} Cookie value or default value.
     */
    publics.getCookie = function(cookieName, defaultValue) {
        let cookies = decodeURIComponent(document.cookie).split(';');
        let name = cookieName + '=';
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return defaultValue;
    };

    return publics;
})();
