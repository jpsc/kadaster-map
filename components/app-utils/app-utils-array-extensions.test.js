import $ from 'jquery';
import ArrayExtensions from './app-utils-array-extensions';

describe('array-extensions component', function() {
    let fixture;
    let component;

    beforeEach(function() {
        fixture = $(['a', 'b', 'c']);
        component = new ArrayExtensions(fixture);
    });

    it('should give next element', function() {
        component.getNextIndexCircular(-1).should.equal(-1);
        component.getNextIndexCircular(0).should.equal(1);
        component.getNextIndexCircular(1).should.equal(2);
        component.getNextIndexCircular(2).should.equal(0);
        component.getNextIndexCircular(3).should.equal(1);
        component.getNextIndexCircular(4).should.equal(2);
        component.getNextIndexCircular(5).should.equal(0);
        component.getNextIndexCircular(2454).should.equal(1);
    });

    it('should get index by a specific criteria', function() {
        component.getIndexBy(e => e === 'a').should.equal(0);
        component.getIndexBy(e => e === 'b').should.equal(1);
        component.getIndexBy(e => e === 'c').should.equal(2);
        component.getIndexBy(e => e === 'd').should.equal(-1);
    });
});
