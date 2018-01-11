import { computed } from 'ember-metal';
import ArrayProxy from '../../../system/array_proxy';
import { A } from '../../../system/native_array';

QUnit.module('ArrayProxy - array observers');

QUnit.test('addArrayObserver works correctly when mutating its content', function(assert) {
  assert.expect(4);

  let proxy = ArrayProxy.create({ content: A([1]) });

  proxy.addArrayObserver({
    arrayWillChange(proxy, startIdx, removeAmt, addAmt) {
      assert.deepEqual(proxy.toArray(), [1]);
      assert.deepEqual([startIdx, removeAmt, addAmt], [0, 1, 3]);
    },
    arrayDidChange(proxy, startIdx, removeAmt, addAmt) {
      assert.deepEqual(proxy.toArray(), ['a', 'b', 'c']);
      assert.deepEqual([startIdx, removeAmt, addAmt], [0, 1, 3]);
    }
  });

  proxy.get('content').replace(0, 1, ['a', 'b', 'c']);
});

QUnit.test('addArrayObserver works correctly when setting a new content', function(assert) {
  assert.expect(4);

  let proxy = ArrayProxy.create({ content: A([1]) });

  proxy.addArrayObserver({
    arrayWillChange(proxy, startIdx, removeAmt, addAmt) {
      assert.deepEqual(proxy.toArray(), [1]);
      assert.deepEqual([startIdx, removeAmt, addAmt], [0, 1, -1]);
    },
    arrayDidChange(proxy, startIdx, removeAmt, addAmt) {
      assert.deepEqual(proxy.toArray(), ['a', 'b', 'c']);
      assert.deepEqual([startIdx, removeAmt, addAmt], [0, -1, 3]);
    }
  });

  proxy.set('content', A(['a', 'b', 'c']));
});

QUnit.test('addArrayObserver with custom arrangedContent works correctly', function(assert) {
  assert.expect(4);

  let proxy = ArrayProxy.extend({
    arrangedContent: computed('content.[]', function() {
      return this.get('content').slice().reverse();
    })
  }).create({ content: A([1]) });

  proxy.addArrayObserver({
    arrayWillChange(proxy, startIdx, removeAmt, addAmt) {
      assert.deepEqual(proxy.toArray(), [1]);
      assert.deepEqual([startIdx, removeAmt, addAmt], [0, 1, -1]);
    },
    arrayDidChange(proxy, startIdx, removeAmt, addAmt) {
      assert.deepEqual(proxy.toArray(), [1, 'c', 'b', 'a']);
      assert.deepEqual([startIdx, removeAmt, addAmt], [0, -1, 4]);
    }
  });

  proxy.get('content').replace(0, 0, ['a', 'b', 'c']);
});

QUnit.test('arrangedContentArray{Will,Did}Change are called when the arranged content changes', function(assert) {
  // The behavior covered by this test may change in the future if we decide
  // that built-in array methods are not overridable.

  let willChangeCallCount = 0;
  let didChangeCallCount = 0;

  let content = A([1, 2, 3]);
  ArrayProxy.extend({
    arrangedContentArrayWillChange() {
      willChangeCallCount++;
      this._super(...arguments);
    },
    arrangedContentArrayDidChange() {
      didChangeCallCount++;
      this._super(...arguments);
    }
  }).create({ content });

  assert.equal(willChangeCallCount, 0);
  assert.equal(didChangeCallCount, 0);

  content.pushObject(4);
  content.pushObject(5);

  assert.equal(willChangeCallCount, 2);
  assert.equal(didChangeCallCount, 2);
});

QUnit.test('arrayContent{Will,Did}Change are called when the content changes', function(assert) {
  // The behavior covered by this test may change in the future if we decide
  // that built-in array methods are not overridable.

  let willChangeCallCount = 0;
  let didChangeCallCount = 0;

  let content = A([1, 2, 3]);
  ArrayProxy.extend({
    arrayContentWillChange() {
      willChangeCallCount++;
      this._super(...arguments);
    },
    arrayContentDidChange() {
      didChangeCallCount++;
      this._super(...arguments);
    }
  }).create({ content });

  assert.equal(willChangeCallCount, 0);
  assert.equal(didChangeCallCount, 0);

  content.pushObject(4);
  content.pushObject(5);

  assert.equal(willChangeCallCount, 2);
  assert.equal(didChangeCallCount, 2);
});
