// Filename: lockfncaching.spec.js  
// Timestamp: 2015.04.10-17:14:40 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var lockfncaching = require('../lib/lockfncaching');

describe("lockfncaching.getNew", function () {
  it("should call onValFn with the value from getValFn", function (done) {
    var fncaching = lockfncaching.getNew();
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
    var fncaching = lockfncaching.getNew();
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
});

describe("lockfncaching", function () {
  it("should call onValFn with the value from first getValFn returning value using default constructor", function (done) {
    var fncaching,
        onvalcallcount = 0,
        getvalcallcount = 0,
        invalidresult = false,
        _ = {};

    fncaching = lockfncaching(function getval (arg1, arg2, arg3_namespace, fn) {
      getvalcallcount++;
      setTimeout(function () { 
        fn(null, 'done' + arg3_namespace); 
      }, 100);
    }); 

    fncaching(_, _, 'b2', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'doneb2') invalidresult = true;
    });

    fncaching(_, _, 'b2', function onvalfn (err, res) {
      onvalcallcount++;
      if (res !== 'doneb2') invalidresult = true;
    });

    fncaching(_, _, 'b1', function onvalfn (err, res) {
      onvalcallcount++;
      if (res !== 'doneb2') invalidresult = true;
    });

    // reset the lock on this function
    fncaching.lock = lockfncaching.getNew();
    fncaching(_, _, 'b2', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'doneb2') invalidresult = true;
    });

    fncaching(_, _, 'b2', function onvalfn (err, res) {
      onvalcallcount++;
      if (res !== 'doneb2') invalidresult = true;
    });

    fncaching(_, _, 'b1', function onvalfn (err, res) {
      onvalcallcount++;
      if (res !== 'doneb2') invalidresult = true;
    });
    

    setTimeout(function () {    
      expect( onvalcallcount ).toBe( 6 );      
      expect( getvalcallcount ).toBe( 2 );      
      expect( invalidresult ).toBe( false );      
      done();
    }, 800);

  });
});

describe("lockfncaching.getNamespaceNew", function () {
  it("should call onValFn with the value from getValFn", function (done) {  
    var fncaching = lockfncaching.getNamespaceNew();
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
    var fncaching = lockfncaching.getNamespaceNew();
    var count = 0;
    var onValFn1 = function (err, val) {
      count += val;
    };
    var onValFn2 = function (err, val) {
      count += val;
    };

    fncaching('a', onValFn2, function getValFn (exitFn) {
      exitFn(null, 6);
    });

    fncaching('a', onValFn1, function getValFn (exitFn) {
      exitFn(null, 3);
    });

    setTimeout(function () {    
      expect( count ).toBe( 12 );      
      done();
    }, 200);
  });

  it("should call onValFn1 with the value from getValFn, namespace '1'", function (done) {  
    var fncaching = lockfncaching.getNamespaceNew();
    var count = 0;
    var onValFn1 = function (err, val) {
      count += val;
    };
    var onValFn2 = function (err, val) {
      count += val;
    };

    fncaching('a', onValFn2, function getValFn (exitFn) {
      exitFn(null, 6);
    });

    fncaching('z', onValFn1, function getValFn (exitFn) {
      exitFn(null, 3);
    });

    setTimeout(function () {    
      expect( count ).toBe( 9 );      
      done();
    }, 200);
  });
});

describe("lockfncaching.namespace", function () {
  it("should call onValFn1 with the value from getValFn, namespace '1' using default constructor", function (done) {  
    var fncaching,
        onvalcallcount = 0,
        getvalcallcount = 0,
        invalidresult = false,
        _ = {};

    fncaching = lockfncaching.namespace(function getval (arg1, arg2, arg3_namespace, fn) {
      getvalcallcount++;
      setTimeout(function () { 
        fn(null, 'done' + arg3_namespace); 
      }, 100);
    }); 

    fncaching(_, _, '2', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'done2') invalidresult = true;
    });

    fncaching(_, _, '2', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'done2') invalidresult = true;
    });

    fncaching(_, _, '1', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'done1') invalidresult = true;
    });

    // reset the lock on this function
    fncaching.lock = lockfncaching.getNamespaceNew();
    fncaching(_, _, '2', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'done2') invalidresult = true;
    });

    fncaching(_, _, '2', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'done2') invalidresult = true;
    });

    fncaching(_, _, '1', function onval (err, res) {
      onvalcallcount++;
      if (res !== 'done1') invalidresult = true;
    });


    fncaching.lock = lockfncaching.getNamespaceNew();

    setTimeout(function () {    
      //expect( onvalcallcount ).toBe( 3 );      
      //expect( getvalcallcount ).toBe( 2 );      

      expect( onvalcallcount ).toBe( 6 );      
      expect( getvalcallcount ).toBe( 4 );      

      expect( invalidresult ).toBe( false );      
      done();
    }, 800);
  });
});

