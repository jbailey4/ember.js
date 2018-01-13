import { SuiteModuleBuilder } from '../suite';
import { get } from 'ember-metal';
import { A as emberA } from '../../../system/native_array';

const suite = SuiteModuleBuilder.create();

suite.module('removeObjects');

suite.test('should return receiver', function(assert) {
  let before = emberA(this.newFixture(3));
  let obj = before;

  assert.equal(obj.removeObjects(before[1]), obj, 'should return receiver');
});

suite.test('[A,B,C].removeObjects([B]) => [A,C] + notify', function(assert) {
  let before = emberA(this.newFixture(3));
  let after = [before[0], before[2]];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects([before[1]]);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

    assert.equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject');
    assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
  }
});

suite.test('[{A},{B},{C}].removeObjects([{B}]) => [{A},{C}] + notify', function(assert) {
  let before = emberA(this.newObjectsFixture(3));
  let after = [before[0], before[2]];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects([before[1]]);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

    assert.equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject');
    assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
  }
});

suite.test('[A,B,C].removeObjects([A,B]) => [C] + notify', function(assert) {
  let before = emberA(this.newFixture(3));
  let after  = [before[2]];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects([before[0], before[1]]);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

    assert.equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject');
    assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
  }
});

suite.test('[{A},{B},{C}].removeObjects([{A},{B}]) => [{C}] + notify', function(assert) {
  let before = emberA(this.newObjectsFixture(3));
  let after = [before[2]];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects([before[0], before[1]]);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

    assert.equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject');
    assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
  }
});

suite.test('[A,B,C].removeObjects([A,B,C]) => [] + notify', function(assert) {
  let before = emberA(this.newFixture(3));
  let after = [];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects([before[0], before[1], before[2]]);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

    assert.equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject');
    assert.equal(observer.timesCalled('lastObject'), 1, 'should have notified lastObject');
  }
});

suite.test('[{A},{B},{C}].removeObjects([{A},{B},{C}]) => [] + notify', function(assert) {
  let before = emberA(this.newObjectsFixture(3));
  let after = [];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects(before);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
    assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

    assert.equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject');
    assert.equal(observer.validate('lastObject'), 1, 'should have notified lastObject');
  }
});

suite.test('[A,B,C].removeObjects([D]) => [A,B,C]', function(assert) {
  let before = emberA(this.newFixture(3));
  let after = before;
  let item = this.newFixture(1)[0];
  let obj = before;
  let observer = this.newObserver(obj, '[]', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); // Prime the cache

  obj.removeObjects([item]); // Note: item not in set

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  if (observer.isEnabled) {
    assert.equal(observer.validate('[]'), false, 'should NOT have notified []');
    assert.equal(observer.validate('length'), false, 'should NOT have notified length');

    assert.equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject');
    assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
  }
});

export default suite;
