import test from 'ava';
import lockfnexpiring from '../lib/lockfnexpiring.js';

test.cb("lockfnexpiring should expire the function after given amount of time", t => {
  var x = 0;
  var f = lockfnexpiring(function () {
    x++;
  }, 2000);

  setTimeout(function () {
    t.is(x, 0);
  }, 1600);

  setTimeout(function () {
    t.is(x, 1);
    t.end();
  }, 2400);
});
