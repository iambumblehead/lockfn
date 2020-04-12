import test from 'ava';
import lockfnqueuing from '../lib/lockfnqueuing.js';

test.cb("lockfnqueuing.getNew should call a queue of functions, one after another", t => {
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

  setTimeout(function () {    
    t.is( count, 3 );
    t.end();
  }, 1000);
});

test.cb("lockfnqueuing should call a queue of functions, one after another, using as constructor", t => {
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

  setTimeout(function () {    
    t.is( count, 2 );
    t.is( invalidresult, false );
    t.end();
  }, 1000);
});

test.cb("lockfnqueuing should allow any number of params as long as last param is callback", t => {
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

  setTimeout(function () {    
    t.is( count, 1 );
    t.is( invalidresult, false );
    t.end();
  }, 5000);
});
