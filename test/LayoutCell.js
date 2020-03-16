import LayoutCell from '../src/LayoutCell.js';
import Chai from 'chai';

let should = Chai.should();
let expect = Chai.expect;
let assert = Chai.assert;

describe('LayoutCell', function () {

    let cell = new LayoutCell();

    it('should have default size values', function () {

        cell.minSize.should.be.a('Object');
        cell.maxSize.should.be.a('Object');
        cell.preferredSize.should.be.a('Object');

        cell.minSize.width.should.be.a('Number');
        cell.minSize.height.should.be.a('Number');
        cell.maxSize.width.should.be.a('Number');
        cell.maxSize.height.should.be.a('Number');
        cell.preferredSize.width.should.be.a('Number');
        cell.preferredSize.height.should.be.a('Number');

    });

    it('should have generated id set', function () {
        cell.id.should.be.a('String');
    });

    it('should have default name set', function () {
        cell.name.should.be.a('String');
    });

    it('should have children array initialized', function () {
        cell.children.should.be.a('Array');
    });

    it('should have zero children after creation', function () {
        cell.children.length.should.equal(0);
    });

    it ('should not have context set after creation', function () {
        should.not.exist(cell.context);
    });
    
});