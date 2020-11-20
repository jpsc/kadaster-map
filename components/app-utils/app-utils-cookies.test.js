import Cookies from './app-utils-cookies';

describe('app-utils-cookies component', function() {
    it('should set and get a cookie', function() {
        //Prepare
        let name = 'test_cookie_name';
        let value = 'test_cookie_value';
        //Act
        Cookies.setCookie(name, value);
        let actual = Cookies.getCookie(name);
        //Assert
        actual.should.equal(value);
    });

    it('should return undefined when getting an unexisting cookie', function() {
        //Act
        let actual = Cookies.getCookie('ThisIsAnUnexistingCookie');
        //Assert
        (typeof actual).should.equal('undefined');
    });

    it('should return defaultValue when getting an unexisting cookie', function() {
        //Prepare
        let defaultValue = 'bambi';
        //Act
        let actual = Cookies.getCookie(
            'ThisIsAnUnexistingCookie',
            defaultValue
        );
        //Assert
        actual.should.equal(defaultValue);
    });

    it('should remove cookie if expired', function() {
        //Prepare
        let name = 'test_cookie_name';
        let value = 'test_cookie_value';
        let expirationDays = -1;
        //Act
        Cookies.setCookie(name, value, expirationDays);
        let actual = Cookies.getCookie(name);
        //Assert
        (typeof actual).should.equal('undefined');
    });
});
