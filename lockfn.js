// Filename: LockFn.js
// Timestamp: 2013.06.22-01:34:33 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: 

var LockFnCaching = require('./lib/lockfncaching');
var LockFnQueuing = require('./lib/lockfnqueuing');
var LockFnRebounding = require('./lib/lockfnrebounding');
var LockFnThrottling = require('./lib/lockfnthrottling');

var LockFn =
  ((typeof module === 'object') ? module : {}).exports = (function () {

  return {
    Queuing : LockFnQueuing,
    Caching : LockFnCaching,
    Rebounding : LockFnRebounding,
    Throttling : LockFnThrottling
  };

}());