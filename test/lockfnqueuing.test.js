import util from 'node:util'
import test from 'node:test'
import assert from 'node:assert/strict'
import lockfnqueuing from '../lib/lockfnqueuing.js';

test("lockfnqueuing.getNew should call a queue of functions, one after another", async () => {
  var lockFnQueuing = lockfnqueuing.getNew();
  var dummyFn = function () {};
  var count = 0;

  lockFnQueuing(dummyFn, function (exitFn) {
    setTimeout(function () {    
      if (count === 0) count++;
      exitFn(count);
    }, 200);
  });

  lockFnQueuing(dummyFn, function (exitFn) {
    setTimeout(function () {    
      if (count === 1) count++;
      exitFn(count);
    }, 300);
  });

  lockFnQueuing(dummyFn, function (exitFn) {
    setTimeout(function () {    
      if (count === 2) count++;
      exitFn(count);
    }, 100);
  });

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 3 );

      resolve()
    }, 1000);
  })
});

test("lockfnqueuing should call a queue of functions, one after another, using as constructor", async () => {
  var count = 0,
      invalidresult = false;

  var lock = lockfnqueuing(function getval (fn) {
    setTimeout(function () {    
      fn(null, ++count);
    }, 400);
  });

  lock(function getval (err, res) {
    if (res !== 1) invalidresult = true;
  });

  lock(function getval (err, res) {
    if (res !== 2) invalidresult = true;
  });

  setTimeout(function () {
    if (count !== 0) invalidresult = true;
  }, 350);

  setTimeout(function () {
    if (count !== 1) invalidresult = true;
  }, 450);

  setTimeout(function () {
    if (count !== 1) invalidresult = true;
  }, 750);

  setTimeout(function () {
    if (count !== 2) invalidresult = true;
  }, 850);

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 2 );
      assert.strictEqual( invalidresult, false );

      resolve()
    }, 1000);
  })
});

test("lockfnqueuing should allow any number of params as long as last param is callback", async () => {
  var count = 0,
      invalidresult = false;

  var lock = lockfnqueuing(function getval (_, __, fn) {
    setTimeout(function () {    
      fn(null, ++count);
    }, 400);
  });

  lock(null, null, function getval (err, res) {
    if (res !== 1) invalidresult = true;
  });

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 1 );
      assert.strictEqual( invalidresult, false );

      resolve()
    }, 5000);
  })
});
