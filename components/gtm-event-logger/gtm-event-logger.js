export class GtmEventLogger {
    constructor(gtmDataLayer) {
        this.gtmDataLayer = gtmDataLayer || window.gtmDataLayer;
    }

    isAvailable() {
        return this.gtmDataLayer !== undefined;
    }

    log({
        event = 'GAEvent',
        eventCategory,
        eventAction,
        eventLabel,
        eventValue,
        nonInteraction = false,
        ...rest
    } = {}) {
        if (!this.isAvailable()) {
            return;
        }

        const data = {
            event: event,
            eventCategory: eventCategory,
            eventAction: eventAction,
            eventLabel: eventLabel,
            eventValue: eventValue,
            nonInteraction: nonInteraction,
            ...rest,
        };

        this.gtmDataLayer.push(data);
    }
}

export default new GtmEventLogger();
