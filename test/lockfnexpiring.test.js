import util from 'node:util'
import test from 'node:test'
import assert from 'node:assert/strict'
import lockfnexpiring from '../lib/lockfnexpiring.js';

test("lockfnexpiring should expire the function after given amount of time", async () => {
  var x = 0;
  var f = lockfnexpiring(function () {
    x++;
  }, 2000);

  setTimeout(function () {
    assert.strictEqual(x, 0);
  }, 1600);

  await new Promise(resolve => {
    setTimeout(function () {
      assert.strictEqual(x, 1);

      resolve()
    }, 2400);
  })
});
