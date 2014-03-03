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

var view1 = new View(document.getElementById('el1'));
var view2 = new View(document.getElementById('el2'));
var view3 = new View(document.getElementById('el3'));

var shifter = new Shifter();

shifter.match('about', view1); // visible on gallery state and sub-states
shifter.match('gallery/photo/:id', view2); // only visible on photo gallery state
shifter.match('*', view3); // always visible

shifter.shift(document.location.hash);