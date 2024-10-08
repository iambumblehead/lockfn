// Filename: lockfn.js
// Timestamp: 2017.04.25-00:04:25 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)

//import lockfncaching from './lib/lockfncaching.js';
//import lockfnqueuing from './lib/lockfnqueuing.js';
//import lockfnexpiring from './lib/lockfnexpiring.js';
//import lockfnrebounding from './lib/lockfnrebounding.js';
//import lockfnthrottling from './lib/lockfnthrottling.js';

export { default as queuing } from "./lib/lockfnqueuing.js"
export { default as caching } from "./lib/lockfncaching.js"
export { default as expiring } from "./lib/lockfnexpiring.js"
export { default as rebounding } from "./lib/lockfnrebounding.js"
export { default as throttling } from "./lib/lockfnthrottling.js"
/*
export default {
  queuing : lockfnqueuing,
  caching : lockfncaching,
  expiring : lockfnexpiring,
  rebounding : lockfnrebounding,
  throttling : lockfnthrottling
};
 */
