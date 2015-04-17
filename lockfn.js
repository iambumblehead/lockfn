// Filename: lockfn.js
// Timestamp: 2015.04.16-17:22:56 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: lockfncaching.js, lockfnqueuing.js, 
// lockfnrebounding.js, lockfnthrottling.js

var lockfncaching = require('./lib/lockfncaching'),
    lockfnqueuing = require('./lib/lockfnqueuing'),
    lockfnexpiring = require('./lib/lockfnexpiring'),
    lockfnrebounding = require('./lib/lockfnrebounding'),
    lockfnthrottling = require('./lib/lockfnthrottling');

var lockfn = ((typeof module === 'object') ? module : {}).exports = {
  queuing : lockfnqueuing,
  caching : lockfncaching,
  expiring : lockfnexpiring,
  rebounding : lockfnrebounding,
  throttling : lockfnthrottling
};
