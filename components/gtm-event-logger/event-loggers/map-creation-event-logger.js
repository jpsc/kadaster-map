import defaultGtmEventLogger from '../gtm-event-logger';
import { BILLING } from '../event-categories';
import { MAP_INSTANCE_CREATED } from '../event-actions';

export default class MapCreationEventLogger {
    constructor(gtmEventLogger) {
        this.gtmEventLogger = gtmEventLogger || defaultGtmEventLogger;
    }

    log(mapPageName) {
        this.gtmEventLogger.log({
            eventCategory: BILLING,
            eventAction: MAP_INSTANCE_CREATED,
            eventLabel: mapPageName,
            nonInteraction: true,
        });
    }
}
