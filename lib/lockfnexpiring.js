// Filename: lockfnexpiring.js
// Timestamp: 2015.04.16-17:42:42 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// auto-call a function after given period of time has passed.
// 
// useful if your script waits on a response from a server -expire
// the wait function after a few seconds.


var lockfnexpiring = module.exports = function (fn, expirems) {
  var fnopen = true,
      expirefn = function () { fnopen && !(fnopen = false) && fn(); };

  setTimeout(expirefn, expirems);

  return expirefn;
};
