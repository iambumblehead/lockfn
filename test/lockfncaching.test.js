// Filename: lockfncaching.spec.js  
// Timestamp: 2015.04.11-03:30:01 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  
import util from 'node:util'
import test from 'node:test'
import assert from 'node:assert/strict'
import lockfncaching from '../lib/lockfncaching.js';

test("lockfncaching.getNew should call onValFn with the value from getValFn", () => {
  const fncaching = lockfncaching.getNew()
  const onValFn = (err, val) => {
    assert.equal( val, 3 )
  }

  util.promisify(fncaching)(onValFn, exitFn => {
    exitFn(null, 3);
  });
});

test("lockfncaching.getNew should call onValFn with the value from first getValFn returning value", async () => {
  var fncaching = lockfncaching.getNew();
  var count = 0;
  var onValFn = function (err, val) {
    count += val;
  };

  util.promisify(fncaching)(onValFn, function getValFn (exitFn) {
    exitFn(null, 3);
  });

  util.promisify(fncaching)(onValFn, function getValFn (exitFn) {
    count += 5;
    exitFn(null, 4);
  });

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.equal(count, 6)

      resolve('ok')
    }, 200);
  })
})

test("lockfncaching should call onValFn with the value from first getValFn returning value using default constructor", async () => {
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
  fncaching.clear();
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
  

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( onvalcallcount, 6 );      
      assert.strictEqual( getvalcallcount, 2 );      
      assert.strictEqual( invalidresult, false );      

      resolve()
    }, 800);
  })
});

test("lockfncaching.getNamespaceNew should call onValFn with the value from getValFn", async () => {
  var fncaching = lockfncaching.getNamespaceNew();
  var count = 0;
  var onValFn = function (err, val) {
    assert.strictEqual( val, 3 );
  };

  fncaching('namespace1', onValFn, function getValFn (exitFn) {
    exitFn(null, 3);
  });
});

test("lockfncaching.getNamespaceNew should call onValFn1 with the value from getValFn, namespace '1'", async () => {
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

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 12 );

      resolve()
    }, 200);
  })
});

test("lockfncaching.getNamespaceNew 2 should call onValFn1 with the value from getValFn, namespace '1'", async () => {  
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

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( count, 9 );

      resolve()
    }, 200);
  })
});

test("lockfncaching.namespace should call onValFn1 with the value from getValFn, namespace '1' using default constructor", async () => {  
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

  fncaching.clear();
  //fncaching.lock = lockfncaching.getNamespaceNew();

  await new Promise(resolve => {
    setTimeout(function () {    
      assert.strictEqual( onvalcallcount, 6 );      
      assert.strictEqual( getvalcallcount, 4 );      
      assert.strictEqual( invalidresult, false );      

      resolve()
    }, 800);
  })
});
