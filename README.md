# Shifter

Shifter is a tiny JavaScript library to manage view states.

It not require any dependency.<br/>
The main goal is to bring a simple api to manage states in a single page application.

## Getting started

```javascript
var s = new Shifter();

s.match('about', view1);              // only visible in "about" state
s.match('gallery/photo/:id', view2);  // visible on all photos state
s.match('*', view3);                  // always visible

// display view1 & view3
s.shift('about');
```

## Usage

The "view" needs to implement a minimal interface in order to function with Shifter, here is an example:

```javascript
function View(domEl) {
    this.transitionIn = function (callback) {
        domEl.style.display = 'block';
        callback();
    };
    this.transitionOut = function (callback) {
        domEl.style.display = 'none';
        callback();
    };
};
```

Complete example [here](/example/example.js).

See in action [here](https://rawgithub.com/singuerinc/Shifter/master/example/index.html).
