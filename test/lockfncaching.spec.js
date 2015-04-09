// Filename: lockfncaching.spec.js  
// Timestamp: 2015.04.08-19:09:26 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var LockFnCaching = require('../lib/lockfncaching');

describe("LockFnCaching", function () {
  it("should call onValFn with the value from getValFn", function (done) {
    var fncaching = LockFnCaching.getNew();
    var count = 0;
    var onValFn = function (err, val) {
      expect( val ).toBe( 3 );      
      done();
    };

    fncaching(onValFn, function getValFn (exitFn) {
      exitFn(null, 3);
    });
  });


  it("should call onValFn with the value from first getValFn returning value", function (done) {
    var fncaching = LockFnCaching.getNew();
    var count = 0;
    var onValFn = function (err, val) {
      count += val;
    };

    fncaching(onValFn, function getValFn (exitFn) {
      exitFn(null, 3);
    });

    fncaching(onValFn, function getValFn (exitFn) {
      count += 5;
      exitFn(null, 4);
    });

    setTimeout(function () {    
      expect( count ).toBe( 6 );      
      done();
    }, 200);
  });

  it("should call onValFn with the value from first getValFn returning value using default constructor", function (done) {
    var count = 0;
    var fncaching = LockFnCaching(function (err, val) {
      count += val;
    });

    fncaching(function getValFn (exitFn) {
      exitFn(null, 3);
    });

    fncaching(function getValFn (exitFn) {
      count += 5;
      exitFn(null, 4);
    });

    setTimeout(function () {    
      expect( count ).toBe( 6 );      
      done();
    }, 200);
  });
});

describe("LockFnCaching (getNamespaceNew)", function () {
  it("should call onValFn with the value from getValFn", function (done) {  
    var fncaching = LockFnCaching.getNamespaceNew();
    var count = 0;
    var onValFn = function (err, val) {
      expect( val ).toBe( 3 );      
      done();
    };

    fncaching('namespace1', onValFn, function getValFn (exitFn) {
      exitFn(null, 3);
    });
  });

  it("should call onValFn1 with the value from getValFn, namespace '1'", function (done) {  
    var fncaching = LockFnCaching.getNamespaceNew();
    var count = 0;
    var onValFn1 = function (err, val) {
      count += val;
    };
    var onValFn2 = function (err, val) {
      count += val;
    };

    fncaching('2', onValFn2, function getValFn (exitFn) {
      exitFn(null, 6);
    });

    fncaching('1', onValFn1, function getValFn (exitFn) {
      exitFn(null, 3);
    });

    setTimeout(function () {    
      expect( count ).toBe( 9 );      
      done();
    }, 200);
  });

  it("should call onValFn1 with the value from getValFn, namespace '1' using default constructor", function (done) {  
    var count = 0;
    var fncaching = LockFnCaching.namespace(function (err, val) {
      count += val;      
    });

    fncaching('2', function getValFn (exitFn) {
      exitFn(null, 6);
    });

    fncaching('1', function getValFn (exitFn) {
      exitFn(null, 3);
    });

    setTimeout(function () {    
      expect( count ).toBe( 9 );      
      done();
    }, 200);
  });

});
