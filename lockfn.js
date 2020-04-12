// Filename: lockfn.js
// Timestamp: 2017.04.25-00:04:25 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)

import lockfncaching from './lib/lockfncaching.js';
import lockfnqueuing from './lib/lockfnqueuing.js';
import lockfnexpiring from './lib/lockfnexpiring.js';
import lockfnrebounding from './lib/lockfnrebounding.js';
import lockfnthrottling from './lib/lockfnthrottling.js';

export default {
  queuing : lockfnqueuing,
  caching : lockfncaching,
  expiring : lockfnexpiring,
  rebounding : lockfnrebounding,
  throttling : lockfnthrottling
};
