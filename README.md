lockfn
======
**(c)[Bumblehead][0], 2013** [MIT-license](#license)

### OVERVIEW:

A collection of function locking objects. Each object returns a function through which asynchronous code may be executed. The [examples](#objects) are more descriptive than any explanation alone.

 * `lockfn.Queuing`, _lockfnqueuing_
 * `lockfn.Caching`, _lockfncaching_
 * `lockfn.Rebounding`, _lockfnrebounding_
 * `lockfn.Throttling`, _lockfnthrottling_

As a convenience, the lock definitions are provided on a single namespace, `lockfn`. They could be used independently, but usually one and all are needed within the same application.

The default function defined on each lock is a convenient '_default_' function which should serve most purposes and allow one to use a lock with fewer lines of code.

[0]: http://www.bumblehead.com                            "bumblehead"

---------------------------------------------------------
#### <a id="install"></a>INSTALL:

lockfn may be downloaded directly or installed through `npm`.

 * **npm**   

 ```bash
 $ npm install lockfn
 ```

 * **Direct Download**
 
 ```bash  
 $ git clone https://github.com/iambumblehead/lockfn.git
 ```

---------------------------------------------------------
#### <a id="objects">OBJECTS:

 - **lockfnqueuing**, **lockfn.Queuing**
   a returned function will store mulitple callbacks and processes them one after another -waiting for the first to complete before calling the next. 'useful for holding off execution of function bodies that would add numerous calls to the stack.

  the following would print `15`, then `10`:

  ```javascript
  fn = function onval (err, res) { console.log(res); };
  lockfn = lockfnqueuing.getNew();
  lockfn(fn, function getval (exitFn) {
    setTimeout(function () { exitFn(null, 15); }, 200);
  });
  lockfn(fn, function getval (exitFn) {
    setTimeout(function () { exitFn(null, 10); }, 200);
  });
  ```

  ... and _default_ use assumes 'onval' function never changes
  ```javascript
  lockfn = lockfnqueuing(function (res) { console.log(res); });
  lockfn(function getval (exitFn) {
    setTimeout(function () { exitFn(null, 15); }, 200);
  });
  lockfn(function getval (exitFn) {
    setTimeout(function () { exitFn(null, 10); }, 200);
  }); 
  ```
 
 - **lockfnrebounding**, **lockfn.Rebounding**
   a returned function will process one callback and during that time, future calls are rebounded until the callback has returned a value. 'useful for handling form submission events, where the form should be submitted once only amid multiple submission calls.

  the following would print `submit one`, only.

  ```javascript
  lockfn = lockfnrebounding.getNew();
  lockfn(function getval (exitFn) {
    setTimeout(function () { 
      console.log('submit one'); exitFn() 
    }, 200);
  });
  lockfn(function getval (exitFn) {
    setTimeout(function () { 
      console.log('submit two'); exitFn() 
    }, 100);
  }); 
  lockfn(function getval (exitFn) {
    console.log('submit three'); exitFn() 
  });
  ```

  ... and _default_ use is same. lockfnrebounding.getNew() is no different from lockfnrebounding().
  ```javascript
  lockfn = lockfnrebounding();
  lockfn(function getval (exitFn) {
    // ...
  });
  ```

 - **lockfnthrottling**, **lockfn.Throttling**
 a returned function will process one callback and during a specified period of time, then it will process the last callback received during that time. 'useful for limiting the execution of functions bound to events triggered rapidly many times.

 the following would print `go`, then `now`: 
 
  ```javascript 
  lockfn = lockfnthrottling.getNew({ ms : 500 });
  lockfn(function () { console.log('go') });
  lockfn(function () { console.log('home') }); 
  lockfn(function () { console.log('now') });
  ```

  ... and _default_ use is same. lockfnthrottling.getNew() is no different from lockfnrebounding().
  ```javascript
  lockfn = lockfnthrottling({ ms : 500 });
  lockfn(function getval (exitFn) {
    // ...
  });
  ```

 - **lockfncaching**, **lockfn.Caching**
   a returned function will store multiple callbacks and to each of them will return a value that is once-only generated by the first call. 'useful for making single request to a web resource that may return data needed by multiple functions.

  the following would print `15`, then (immediately) `15`:

  ```javascript
  fn = function onval (err, val) { console.log(null, val); };
  lockfn = lockfncaching.getNew();
  lockfn(fn, function getval (exitFn) {
    setTimeout(function () { exitFn(null, 15); }, 200);
  });
  lockfn(fn, function getval (exitFn) {
    setTimeout(function () { exitFn(null, 10); }, 200);
  }); 
  ```
 
  this object also returns a function that will associate callbacks with a given namespace.

  the following would print `15`, then (immediately) `15`:
 
  ```javascript
  fn = function onval (err, val) { console.log(null, val); };
  lockfn = lockfncaching.getNamespaceNew();
  lockfn('address', fn, function getval (exitFn) {
    setTimeout(function () { exitFn(null, 15); }, 200);
  });
  lockfn('country', function getval (exitFn) {
    setTimeout(function () { exitFn(null, 10); }, 200);
  }); 
  lockfn('address', function getval (exitFn) {
    setTimeout(function () { exitFn(null, 19); }, 200);
  });
  ```
  
  ... and both have _default_ uses which assumes 'onval' function never changes
  ```javascript
  lockfn = lockfncaching(function (err, val) {
    console.log('final val is ', val);
  });
  lockfn(function (exitFn) {
    setTimeout(function () { exitFn(null, 15); }, 200);
  });
  lockfn(function (exitFn) {
    setTimeout(function () { exitFn(null, 10); }, 200);
  });
  ```
  ```javascript
  lockfn = lockfncaching.namespace(function (err, val) {
    console.log('final val is ', val);
  });
  lockfn('country', function (exitFn) {
    setTimeout(function () { exitFn(null, 15); }, 200);
  });
  lockfn('address', function (exitFn) {
    setTimeout(function () { exitFn(null, 10); }, 200);
  });
  ```

---------------------------------------------------------

#### <a id="license">License:

![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) 2013 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
