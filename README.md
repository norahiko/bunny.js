bunny.js
========

Simple JavaScript PubSub library (under construction...)

## Usage

``` js

var bunny = require('bunny');

var hub = new bunny.Hub();

var usr = hub.Publisher('user');

var msg = hub.Publisher('greeting', 'Hello');

var greeting = hub.Subscriber('user greeting', function(user, greeting) {
    // async callback
    console.log(greeting + ': ' + user);
    greeting.close();
});

usr.pub('World');

console.log('logged in');

// output

// logged in
// Hello: World
```
