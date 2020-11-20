import track from './track';

describe('Track', () => {
    it('should track given event', () => {
        const analytics = { track: sinon.spy() };
        const eventName = 'Listing Viewed';

        track(eventName, { navigation_trigger: 'contact' }, false, analytics, {
            global_id: 123,
        });

        expect(analytics.track).to.have.been.calledWith(eventName, {
            global_id: 123,
            navigation_trigger: 'contact',
        });
    });
});
