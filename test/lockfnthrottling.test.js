// Filename: lockfnthrottling.spec.js  
// Timestamp: 2016.01.04-13:31:28 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import test from 'ava';
import LockFnThrottling from '../lib/lockfnthrottling.js';

test("LockFnThrottling should call a function only once for time period (400ms)", t => {
  var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
  var count = 0;

  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count++; });
  
  t.is( count, 1 );
});

test.cb("LockFnThrottling should call functions only once for time period (400ms)", t => {
  var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
  var count = 0;

  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count++; });

  setTimeout(function () {    
    lockFnThrottling(function () { count++; });    
  }, 200);

  setTimeout(function () {    
    lockFnThrottling(function () { count++; });    
    t.is( count, 3 );
    t.end();
  }, 600);
});

test.cb("LockFnThrottling should call the last uncalled function during time period (400ms)", t => {
  var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
  var count = 0;

  lockFnThrottling(function () { count++; });
  lockFnThrottling(function () { count += 6; });
  lockFnThrottling(function () { count++; });

  setTimeout(function () {    
    t.is( count, 2 );
    t.end();
  }, 600);
});

test.cb("LockFnThrottling should provide an interface for single throttled function during time period (400ms)", t => {
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

  setTimeout(function () {    
    t.is( count, 5 );
    t.end();
  }, 600);
});
