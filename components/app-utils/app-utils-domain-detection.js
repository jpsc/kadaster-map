export default class AppDomainDetection {
    static isFundaInBusiness() {
       return this.getHostname().includes('fundainbusiness');
    }

    static getHostname() {
        return window.location.hostname;
    }
}
