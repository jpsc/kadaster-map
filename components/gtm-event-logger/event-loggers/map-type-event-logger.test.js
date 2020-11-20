import sinonTestFactory from 'sinon-test';
const sinonTest = sinonTestFactory(sinon);

import { GtmEventLogger } from '../gtm-event-logger';
import MapTypeEventLogger from './map-type-event-logger';

describe('The MapTypeEventLogger', () => {
    let logger;
    let pushEventSpy;

    beforeEach(() => {
        pushEventSpy = sinon.spy();

        const gtmEventLogger = new GtmEventLogger({ push: pushEventSpy });
        logger = new MapTypeEventLogger(gtmEventLogger);
    });

    it(
        'should log an event using the gtmEventLogger',
        sinonTest(function() {
            logger.log('satellite');

            sinon.assert.calledWith(pushEventSpy, {
                event: 'mapTypeChanged',
                eventAction: undefined,
                eventCategory: undefined,
                eventLabel: undefined,
                eventValue: undefined,
                mapTypeName: 'satellite',
                nonInteraction: false,
            });
        })
    );
});
