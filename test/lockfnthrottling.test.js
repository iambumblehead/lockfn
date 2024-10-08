// Filename: lockfnthrottling.spec.js  
// Timestamp: 2016.01.04-13:31:28 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>
import util from 'node:util'
import test from 'node:test'
import assert from 'node:assert/strict'
import LockFnThrottling from '../lib/lockfnthrottling.js';

test("LockFnThrottling should call a function only once for time period (400ms)", async () => {
  var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
  var count = 0;

  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count++; });
  
  assert.strictEqual( count, 1 );
});

test("LockFnThrottling should call functions only once for time period (400ms)", async () => {
  var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
  var count = 0;

  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count++; });

  setTimeout(function () {    
    lockFnThrottling(function () { count++; });    
  }, 200);

  await new Promise(resolve => {
  setTimeout(function () {    
    lockFnThrottling(function () { count++; });    
    assert.strictEqual( count, 3 );

    resolve()
  }, 600);
  })
});

test("LockFnThrottling should call the last uncalled function during time period (400ms)", async () => {
  var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
  var count = 0;

  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count += 6; });
  lockFnThrottling(function () { count++; });

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 2 );
      resolve()
    }, 600);
  })
});

test("LockFnThrottling should provide an interface for single throttled function during time period (400ms)", async () => {
  var count = 0;
  var lockFnThrottling = LockFnThrottling({
    ms : 500,
    isendthrottlecall : false
  }, function (num) {
    count += num;
  });
  

  lockFnThrottling(5);
  lockFnThrottling(3);
  lockFnThrottling(1);

  await new Promise(resolve => {
    setTimeout(function () {
      assert.strictEqual( count, 5 );

      resolve()
    }, 600);
  })
});
