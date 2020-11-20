import AppDomainDetection from './app-utils-domain-detection';

AppDomainDetection.getHostname = sinon.stub();

describe('app-utils-domain-detection component', () => {
    it('should return false if fundainbusiness does not exists in the hostaname in production', () => {
        AppDomainDetection.getHostname.returns('funda');
        assert.equal(AppDomainDetection.isFundaInBusiness(), false);
    });
    it('should return true if fundainbusiness does exists in the hostaname in production', () => {
        AppDomainDetection.getHostname.returns('fundainbusiness');
        assert.equal(AppDomainDetection.isFundaInBusiness(), true);
    });
    it('should return false if fundainbusiness does not exists in the hostaname in an enviroment', () => {
        AppDomainDetection.getHostname.returns('int.dev.funda');
        assert.equal(AppDomainDetection.isFundaInBusiness(), false);
    });
    it('should return true if fundainbusiness does exists in the hostaname in an enviroment', () => {
        AppDomainDetection.getHostname.returns('int.dev.fundainbusiness');
        assert.equal(AppDomainDetection.isFundaInBusiness(), true);
    });
});
