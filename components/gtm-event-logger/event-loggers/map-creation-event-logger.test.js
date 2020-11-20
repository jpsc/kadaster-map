import sinonTestFactory from 'sinon-test';
const sinonTest = sinonTestFactory(sinon);

import { GtmEventLogger } from '../gtm-event-logger';
import MapCreationEventLogger from './map-creation-event-logger';

describe('The MapCreationEventLogger', () => {
    let logger;
    let pushEventSpy;

    beforeEach(() => {
        pushEventSpy = sinon.spy();

        const gtmEventLogger = new GtmEventLogger({ push: pushEventSpy });
        logger = new MapCreationEventLogger(gtmEventLogger);
    });

    it(
        'should log an event using the gtmEventLogger',
        sinonTest(function() {
            logger.log('search-on-map');

            sinon.assert.calledWith(pushEventSpy, {
                event: 'GAEvent',
                eventAction: 'map-instance-created',
                eventCategory: 'billing',
                eventLabel: 'search-on-map',
                eventValue: undefined,
                nonInteraction: true,
            });
        })
    );
});
