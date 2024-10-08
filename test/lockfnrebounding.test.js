import test from 'ava';
import lockfnrebounding from '../lib/lockfnrebounding.js';

test.cb("should rebound calls if first call is not finished", t => {
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

  setTimeout(function () {    
    t.is( count, 1 );
    t.end();
  }, 500);
});

test.cb("should accept calls after first call is not finished", t => {
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

  setTimeout(function () {    
    t.is( count, 2 );
    t.end();
  }, 500);
});

test.cb("should not require a callback", t => {
  var count = 0;
  var reboundfn = lockfnrebounding(function (fn) {
    count++;
    setTimeout(function () {    
      fn();
    }, 100);
  });

  reboundfn();
  reboundfn();

  setTimeout(function () {    
    t.is( count, 1 );
    t.end();
  }, 200);
});

test.cb("should not require a callback, longer", t => {
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

  setTimeout(function () {    
    t.is( count, 2 );
    t.end();
  }, 500);
});

test.cb("should call the callback will all arguments passed by caller", t => {
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

  setTimeout(function () {    
    t.is( count, 2 );
    t.end();
  }, 500);
});

test.cb("should call 2 future callback will all arguments passed by caller", t => {
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

  setTimeout(function () {    
    t.is( count, 4 );
    t.end();
  }, 600);
});

