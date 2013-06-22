var LockFnRebounding = require('../lib/lockfnrebounding');

describe("LockFnRebounding", function () {
  it("should rebound calls if first call is not finished", function (done) {
    var lockFnRebounding = LockFnRebounding.getNew(),
        count = 0;

    lockFnRebounding(function (exitFn) {
      count++;
      setTimeout(function () {    
        exitFn();
      }, 400);
    });

    lockFnRebounding(function (exitFn) {
      count++;
      exitFn();
    });

    setTimeout(function () {    
      expect( count ).toBe( 1 );
      done();
    }, 500);
  });

  it("should accept calls after first call is not finished", function (done) {
    var lockFnRebounding = LockFnRebounding.getNew(),
        count = 0;

    lockFnRebounding(function (exitFn) {
      count++;
      setTimeout(function () {    
        exitFn();
      }, 200);
    });

    setTimeout(function () {        
      lockFnRebounding(function (exitFn) {
        count++;
        exitFn();
      });
    }, 300);

    setTimeout(function () {    
      expect( count ).toBe( 2 );
      done();
    }, 500);
  });

});