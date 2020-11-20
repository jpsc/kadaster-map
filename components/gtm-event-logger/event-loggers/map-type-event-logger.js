import defaultGtmEventLogger from '../gtm-event-logger';

export default class MapTypeEventLogger {
    constructor(gtmEventLogger) {
        this.gtmEventLogger = gtmEventLogger || defaultGtmEventLogger;
    }

    log(mapTypeName) {
        this.gtmEventLogger.log({
            event: 'mapTypeChanged',
            mapTypeName: mapTypeName,
        });
    }
}
