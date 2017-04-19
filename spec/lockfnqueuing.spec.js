var lockfnqueuing = require('../lib/lockfnqueuing');

describe("lockfnqueuing.getNew", function () {
  it("should call a queue of functions, one after another", function (done) {
    var lockFnQueuing = lockfnqueuing.getNew();
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

describe("lockfnqueuing", function () {
  it("should call a queue of functions, one after another, using as constructor", function (done) {
    var count = 0,
        invalidresult = false;

    var lock = lockfnqueuing(function getval (fn) {
      setTimeout(function () {    
        fn(null, ++count);
      }, 400);
    });

    lock(function getval (err, res) {
      if (res !== 1) invalidresult = true;
    });

    lock(function getval (err, res) {
      if (res !== 2) invalidresult = true;
    });

    setTimeout(function () {
      if (count !== 0) invalidresult = true;
    }, 350);

    setTimeout(function () {
      if (count !== 1) invalidresult = true;
    }, 450);

    setTimeout(function () {
      if (count !== 1) invalidresult = true;
    }, 750);

    setTimeout(function () {
      if (count !== 2) invalidresult = true;
    }, 850);

    setTimeout(function () {    
      expect( count ).toBe( 2 );
      expect( invalidresult ).toBe( false );
      done();
    }, 1000);
  });


  it("should allow any number of params as long as last param is callback", function (done) {
    var count = 0,
        invalidresult = false;

    var lock = lockfnqueuing(function getval (_, __, fn) {
      setTimeout(function () {    
        fn(null, ++count);
      }, 400);
    });

    lock(null, null, function getval (err, res) {
      if (res !== 1) invalidresult = true;
    });

    setTimeout(function () {    
      expect( count ).toBe( 1 );
      expect( invalidresult ).toBe( false );
      done();
    }, 5000);
  });
});
