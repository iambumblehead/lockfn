import util from 'node:util'
import test from 'node:test'
import assert from 'node:assert/strict'
import lockfnrebounding from '../lib/lockfnrebounding.js';

test("should rebound calls if first call is not finished", async () => {
  var lockFnRebounding = lockfnrebounding.getNew(),
      count = 0;

  lockFnRebounding(function (exitFn) {
    count++;
    setTimeout(function () {    
      exitFn();
    }, 400);
  });

  lockFnRebounding(function (exitFn) {
    count++;
    exitFn();
  });

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 1 );

      resolve()
    }, 500);
  })
});

test("should accept calls after first call is not finished", async () => {
  var lockFnRebounding = lockfnrebounding.getNew(),
      count = 0;

  lockFnRebounding(function (exitFn) {
    count++;
    setTimeout(function () {    
      exitFn();
    }, 200);
  });

  setTimeout(function () {        
    lockFnRebounding(function (exitFn) {
      count++;
      exitFn();
    });
  }, 300);

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 2 );

      resolve()
    }, 500);
  })
});

test("should not require a callback", async () => {
  var count = 0;
  var reboundfn = lockfnrebounding(function (fn) {
    count++;
    setTimeout(function () {    
      fn();
    }, 100);
  });

  reboundfn();
  reboundfn();

  await new Promise(resolve => {
    setTimeout(function () {
      assert.strictEqual( count, 1 );

      resolve()
    }, 200)
  })
});

test("should not require a callback, longer", async () => {
  var count = 0;
  var reboundfn = lockfnrebounding(function (exitFn) {
    count++;
    setTimeout(function () {
      exitFn();
    }, 200);
  });

  reboundfn();
  reboundfn();

  setTimeout(reboundfn, 300);

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 2 );

      resolve()
    }, 500);
  })
});

test("should call the callback will all arguments passed by caller", async () => {
  var count = 0;
  var reboundfn = lockfnrebounding(function (a, b, c, exitFn) {
    count++;
    setTimeout(function () {    
      exitFn();
    }, 200);
  });

  reboundfn('a', 'b', 'c');
  reboundfn('a', 'b', 'c');

  setTimeout(function () {
    reboundfn('a', 'b', 'c');
  }, 300);

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 2 );
      resolve()
    }, 500);
  })
});

test("should call 2 future callback will all arguments passed by caller", async () => {
  var count = 0;
  var reboundfn = lockfnrebounding(function (a, b, c, exitFn) {
    count++;
    setTimeout(function () {    
      exitFn(5, 6);
    }, 200);
  });

  // called
  reboundfn('a', 'b', 'c', function (num1, num2) {
    if (num1 === 5 && num2 === 6) {
      count++;
    }
  });
  reboundfn('a', 'b', 'c', function (num1, num2) {
    if (num1 === 5 && num2 === 6) {
      count++;
    }
  });

  // should also be called
  setTimeout(function () {
    reboundfn('azz', 'b', 'c', function (num1, num2) {
      if (num1 === 5 && num2 === 6) {
        count++;
      }
    });
  }, 300);

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 4 );
    
      resolve()
    }, 600);
  })
});

