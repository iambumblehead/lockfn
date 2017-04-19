
var lockfnexpiring = require('../lib/lockfnexpiring');

describe("lockfnexpiring", function () {
  it("should expire the function after given amount of time", function (done) {

    var x = 0;
    var f = lockfnexpiring(function () {
      x++;
    }, 2000);

    setTimeout(function () {
      expect(x).toBe(0);
    }, 1600);

    setTimeout(function () {
      expect(x).toBe(1);
      done();
    }, 2400);
  });
});
