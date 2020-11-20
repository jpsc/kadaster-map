import sinonTestFactory from 'sinon-test';
const sinonTest = sinonTestFactory(sinon);

import { GtmEventLogger } from './gtm-event-logger';

describe('The GtmEventLogger', () => {
    let logger;
    let gtmDataLayer;

    beforeEach(() => {
        gtmDataLayer = {
            push: sinon.spy(),
        };

        logger = new GtmEventLogger(gtmDataLayer);
    });

    it(
        'should push the event to the gtmDataLayer when logging',
        sinonTest(function() {
            logger.log();
            sinon.assert.callCount(gtmDataLayer.push, 1);
        })
    );
});
