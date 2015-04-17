lockfn
======
**(c)[Bumblehead][0], 2013,2014,2015** [MIT-license](#license)

## OVERVIEW:

A collection of function locks. Each returns a function through which asynchronous code may be controlled. 

 * [`lockfn.queuing`](#queuing)
 * [`lockfn.caching`](#caching)
 * [`lockfn.expiring`](#expiring) 
 * [`lockfn.rebounding`](#rebounding)
 * [`lockfn.throttling`](#throttling)

[0]: http://www.bumblehead.com                            "bumblehead"

---------------------------------------------------------
### <a id="install"></a>INSTALL:

**npm**
```bash
$ npm install lockfn
```

**direct download**
```bash
$ git clone https://github.com/iambumblehead/lockfn.git
```

---------------------------------------------------------
### <a id="objects"></a>Objects:

 - <a id="caching"></a>**lockfn.caching**
   Most common lock. Obtain data _once_ for multiple callers.

   A template applied to each item of a list view will be requested _once only_:
   ```javascript
   gettpl = function (tplname, fn) {
     server_request(tplname, function (err, tpl) {
        fn(err, tpl); // tpl is '<b>tpl</b>'
     });
   };
   gettplcache = lockfn.caching(function (tplname, fn) {
     gettpl(tplname, fn)
   };
   gettplcache('listitem.mustache', function (err, tpl) {
     console.log('tpl is ' + tpl);        // tpl is <b>item</b>
   });
   gettplcache('listitem.mustache', function (err, tplcached) {
     console.log('tpl is ' + tplcached);  // tpl is <b>item</b>
   });
   ```

   This list uses different templates and _unique_ templates are requested _once only_:
   ```javascript
   // difference between lockfn.caching and lockfn.caching.namespace...
   //
   //   lockfn.caching: the first value obtained is returned to all callers.
   //   if 'lakelistitem.mustache' is obtained first, it is returned to all
   //   callers.
   //
   //   lockfn.caching.namespace: applies caching to values unique to string
   //   param given before the callback. Here 'lakelistitem.mustache' returns a
   //   cached value to calls for 'lakelistitem.mustache'. A different value is
   //   requested and cached for 'countrylistitem.mustache':
   gettplcache = lockfn.caching.namespace(function (tplname, fn) {
     gettpl(tplname, fn)
   };
   gettplcache('lakelistitem.mustache', function (err, tpl) {
     console.log('tpl is ' + tpl);       // tpl is <b>lake</b>
   });
   gettplcache('lakelistitem.mustache', function (err, tplcached) {
     console.log('tpl is ' + tplcached); // tpl is <b>lake</b>
   });
   gettplcache('countrylistitem.mustache', function (err, ctpl) {
     console.log('tpl is ' + tpl);       // tpl is <b>country</b>
   });
   gettplcache('countrylistitem.mustache', function (err, ctplcached) {
     console.log('tpl is ' + tplcached); // tpl is <b>country</b>
   });
   ```
 
   Use multiple params with functions returned by `lockfn.caching` and `lockfn.caching.namespace`. Both require a callback as _last_ parameter. `lockfn.caching.namespace` requires a string as the _second-to-last_  parameter (a namespace for which the cache is held).
   ```javascript
   gettplcache = lockfn.caching.namespace(function (session, cfg, tplname, fn) {
     gettpl(tplname, fn)
   };
   gettplcache(session, cfg, 'nav.mustache', function (err, tpl) {
     console.log('tpl is ' + tpl);      // tpl is <b>nav</b>
   });
   gettplcache(session, cfg, 'nav.mustache', function (err, tplcache) {
     console.log('tpl is ' + tplcache); // tpl is <b>nav</b>
   });
   gettplcache(session, cfg, 'foot.mustache', function (err, tplcache) {
     console.log('tpl is ' + tplcache); // tpl is <b>foot</b>
   });
   ```

   Clear the cache and request the template anew
   ```javascript
   gettplcache = lockfn.caching.namespace(function (session, cfg, tplname, fn) {
     gettpl(tplname, fn)
   };
   session = 'english';
   gettplcache(session, cfg, 'bathroom.mustache', function (err, tpl) {
     console.log(tpl);      // <b>i need the bathroom</b>
   });
   session = 'spanish';
   gettplcache(session, cfg, 'bathroom.mustache', function (err, tplcache) {
     console.log(tplcache); // <b>i need the bathroom</b>
   });
   gettplcache.clear();
   gettplcache(session, cfg, 'bathroom.mustache', function (err, tpl) {
     console.log(tpl);      // <b>puedo ir al bano</b>
   });
   session = 'english';
   gettplcache(session, cfg, 'bathroom.mustache', function (err, tpl) {
     console.log(tpl);      // <b>puedo ir al bano</b>
   });
   ```

 - <a id="queuing"></a>**lockfn.expiring**
   Auto-call a function after given period of time has passed. If a function waits on a response from a server -auto-call that function after a few seconds (and do not allow future calls to the function).
   ```javascript
   lockfn.expiring(function callmeafter5sec () {
     console.log('called in 5 seconds or less');
   }, 5000);
   ```

 - <a id="queuing"></a>**lockfn.queuing**
   Avoid stack overflow. Control caller access to a function that adds numerous frames to the stack by queuing calls so each completes before next begins:
  ```javascript
  getdecryptedblobqueue = lockfn.queuing(function (cipher, fn) {
    fn(null, busydecryption(cipher)); // busydecryption adds numerous frames
  });
  getdecryptedblobqueue(cipher, function (plain) {
    console.log(plain); // long string
  });
  getdecryptedblobqueue(cipher, function (plain) {
    console.log(plain); // long string
  }); 
  ```

  Like [`lockfn.caching`](#caching), a callback is required as the _last_ parameter. Other params given in calls to the lock are passed to the function the lock was constructed around.
  ```javascript
  getdecryptedblobqueue = lockfn.queuing(function (cipher, key, type, fn) {
    fn(null, busydecryption(cipher, key, type));
  });
  getdecryptedblobqueue(cipher, key, type, function (plain) {
    console.log(plain); // long string
  });
  ```
 
 - <a id="rebounding"></a>**lockfn.rebounding**
   A returned function handles one call, ignoring other calls until the first returns. Useful for handling form submit events, where a form should be submitted once only amid multiple submit events.
  ```javascript
  // the following would print 'submit one' only
  lockrebound = lockfn.rebounding();
  lockrebound(function (exitfn) {
    setTimeout(function () { 
      console.log('submit one');  // submit one
      exitfn() 
    }, 200);
  });
  lockrebound(function (exitfn) {
    setTimeout(function () { 
      console.log('submit two');
      exitfn() 
    }, 100);
  }); 
  lockrebound(function (exitfn) {
    console.log('submit three');
    exitfn() 
  });
  ```

 - <a id="throttling"></a>**lockfn.throttling**
   A returned function handles first and last calls made within a specified amount of time. Other calls during that time are ignored. Limit calls which may be triggered rapidly many times. For example ,

   The following would print 'rain', 'spain', then 'plain': 
   ```javascript 
   lockthrottle = lockfn.throttling({ ms : 500 });
   lockthrottle(function () { console.log('rain') });  // rain
   lockthrottle(function () { console.log('in') });
   lockthrottle(function () { console.log('spain') }); // spain
   lockthrottle(function () {
     setTimeout(function () {
       console.log('plain') };                         // plain
     }, 600)
   });
   ```
  
---------------------------------------------------------
### <a id="how"></a>How:

Locks here are simple but effective due to the execution model found in [various][1] [ECMAScript][2] environments. Messages are handled in a queue sequentially, protecting the space in one lock call from following and previous calls.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
[2]: http://nikhilm.github.io/uvbook/eventloops.html

---------------------------------------------------------

### <a id="license">License:

![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) 2013,2014,2015 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
