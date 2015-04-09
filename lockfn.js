// Filename: lockfn.js
// Timestamp: 2015.04.08-19:02:03 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: lockfncaching.js, lockfnqueuing.js, 
// lockfnrebounding.js, lockfnthrottling.js

var lockfncaching = require('./lib/lockfncaching');
var lockfnqueuing = require('./lib/lockfnqueuing');
var lockfnrebounding = require('./lib/lockfnrebounding');
var lockfnthrottling = require('./lib/lockfnthrottling');

var lockfn = ((typeof module === 'object') ? module : {}).exports = {
  Queuing : lockfnqueuing,
  Caching : lockfncaching,
  Rebounding : lockfnrebounding,
  Throttling : lockfnthrottling
};
