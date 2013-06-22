var LockFnQueuing = require('../lib/lockfnqueuing');

describe("LockFnQueuing", function () {
  it("should call a queue of functions, one after another", function (done) {
    var lockFnQueuing = LockFnQueuing.getNew();
    var dummyFn = function () {};
    var count = 0;

    lockFnQueuing(dummyFn, function (exitFn) {
      setTimeout(function () {    
        if (count === 0) count++;
        exitFn(count);
      }, 200);
    });

    lockFnQueuing(dummyFn, function (exitFn) {
      setTimeout(function () {    
        if (count === 1) count++;
        exitFn(count);
      }, 300);
    });

    lockFnQueuing(dummyFn, function (exitFn) {
      setTimeout(function () {    
        if (count === 2) count++;
        exitFn(count);
      }, 100);
    });

    setTimeout(function () {    
      expect( count ).toBe( 3 );
      done();
    }, 1000);
  });
});