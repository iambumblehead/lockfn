// Filename: lockfn.js
// Timestamp: 2013.09.05-19:26:00 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: lockfncaching.js, lockfnqueuing.js, 
// lockfnrebounding.js, lockfnthrottling.js

var lockfncaching = require('./lib/lockfncaching');
var lockfnqueuing = require('./lib/lockfnqueuing');
var lockfnrebounding = require('./lib/lockfnrebounding');
var lockfnthrottling = require('./lib/lockfnthrottling');

var lockfn =
  ((typeof module === 'object') ? module : {}).exports = (function () {

  return {
    Queuing : lockfnqueuing,
    Caching : lockfncaching,
    Rebounding : lockfnrebounding,
    Throttling : lockfnthrottling
  };

}());