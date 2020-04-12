// Filename: lockfncaching.spec.js  
// Timestamp: 2015.04.11-03:30:01 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

import test from 'ava';
import lockfncaching from '../lib/lockfncaching.js';

test.cb("lockfncaching.getNew should call onValFn with the value from getValFn", t => {
  var fncaching = lockfncaching.getNew();
  var count = 0;
  var onValFn = function (err, val) {
    t.is( val, 3 );
    t.end();
  };

  fncaching(onValFn, function getValFn (exitFn) {
    exitFn(null, 3);
  });
});

test.cb("lockfncaching.getNew should call onValFn with the value from first getValFn returning value", t => {
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
    t.is( count, 6 );      
    t.end();
  }, 200);
});


test.cb("lockfncaching should call onValFn with the value from first getValFn returning value using default constructor", t => {
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
  

  setTimeout(function () {    
    t.is( onvalcallcount, 6 );      
    t.is( getvalcallcount, 2 );      
    t.is( invalidresult, false );      
    t.end();
  }, 800);
});

test.cb("lockfncaching.getNamespaceNew should call onValFn with the value from getValFn", t => {
  var fncaching = lockfncaching.getNamespaceNew();
  var count = 0;
  var onValFn = function (err, val) {
    t.is( val, 3 );      
    t.end();
  };

  fncaching('namespace1', onValFn, function getValFn (exitFn) {
    exitFn(null, 3);
  });
});

test.cb("lockfncaching.getNamespaceNew should call onValFn1 with the value from getValFn, namespace '1'", t => {
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
    t.is( count, 12 );      
    t.end();
  }, 200);
});

test.cb("lockfncaching.getNamespaceNew 2 should call onValFn1 with the value from getValFn, namespace '1'", t => {  
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
    t.is( count, 9 );      
    t.end();
  }, 200);
});

test.cb("lockfncaching.namespace should call onValFn1 with the value from getValFn, namespace '1' using default constructor", t => {  
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

  setTimeout(function () {    
    t.is( onvalcallcount, 6 );      
    t.is( getvalcallcount, 4 );      
    t.is( invalidresult, false );      
    t.end();
  }, 800);
});
