// Filename: lockfn.js
// Timestamp: 2017.04.25-00:04:25 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)

var lockfncaching = require('./lib/lockfncaching'),
    lockfnqueuing = require('./lib/lockfnqueuing'),
    lockfnexpiring = require('./lib/lockfnexpiring'),
    lockfnrebounding = require('./lib/lockfnrebounding'),
    lockfnthrottling = require('./lib/lockfnthrottling');

const lockfn = module.exports = {
  queuing : lockfnqueuing,
  caching : lockfncaching,
  expiring : lockfnexpiring,
  rebounding : lockfnrebounding,
  throttling : lockfnthrottling
};
