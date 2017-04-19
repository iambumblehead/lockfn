// Filename: lockfnthrottling.spec.js  
// Timestamp: 2016.01.04-13:31:28 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

var LockFnThrottling = require('../lib/lockfnthrottling');

describe("LockFnThrottling", function () {
  it("should call a function only once for time period (400ms)", function () {
    var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
    var count = 0;

    lockFnThrottling(function () { count++; });
    lockFnThrottling(function () { count++; });
  
    expect( count ).toBe( 1 );
  });

  it("should call functions only once for time period (400ms)", function (done) {
    var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
    var count = 0;

    lockFnThrottling(function () { count++; });
    lockFnThrottling(function () { count++; });
    lockFnThrottling(function () { count++; });

    setTimeout(function () {    
      lockFnThrottling(function () { count++; });    
    }, 200);

    setTimeout(function () {    
      lockFnThrottling(function () { count++; });    
      expect( count ).toBe( 3 );
      done();
    }, 600);
  });

  it("should call the last uncalled function during time period (400ms)", function (done) {
    var lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
    var count = 0;

    lockFnThrottling(function () { count++; });
    lockFnThrottling(function () { count += 6; });
    lockFnThrottling(function () { count++; });

    setTimeout(function () {    
      expect( count ).toBe( 2 );
      done();
    }, 600);
  });

  it("should provide an interface for single throttled function during time period (400ms)", function (done) {
    var count = 0;
    var lockFnThrottling = LockFnThrottling({
      ms : 500,
      isendthrottlecall : false
    }, function (num) {
      count += num;
    });
    

    lockFnThrottling(5);
    lockFnThrottling(3);
    lockFnThrottling(1);

    setTimeout(function () {    
      expect( count ).toBe( 5 );
      done();
    }, 600);
  });

});
