function View() {
    this.init = function (onCompleteCallback) {
        onCompleteCallback();
    };
    this.transitionIn = function (onCompleteCallback) {
        onCompleteCallback();
    };
    this.transitionOut = function (onCompleteCallback) {
        onCompleteCallback();
    };
};

describe('shifter.currentPath', function () {

    var view1, view2, view3, shifter;

    beforeEach(function () {

        view1 = new View();
        view2 = new View();
        view3 = new View();

        shifter = new Shifter();
    });

    afterEach(function () {

        view1 = null;
        view2 = null;
        view3 = null;

        shifter = null;
    });

    it('currentPath should be empty when init', function () {
        expect(shifter.currentPath).toEqual('');
    });

    it('currentPath should be equal after start call', function () {

        shifter.match('view1', view1);
        shifter.shift('view1');

        expect(shifter.currentPath).not.toEqual('');
        expect(shifter.currentPath).toEqual('view1');
    });

    it('currentPath should not be changed if no view is associated with the state', function () {

        shifter.match('view1', view1);
        shifter.shift('view1');
        expect(shifter.currentPath).toEqual('view1');

        shifter.shift('state2');
        expect(shifter.currentPath).toEqual('view1');
    });

});

describe('shifter.onSwap', function(){

    var view1, shifter;

    beforeEach(function () {

        view1 = new View();
        shifter = new Shifter();
    });

    afterEach(function () {

        view1 = null;
        shifter = null;
    });

    it('call onSwap if callback is defined', function () {

        shifter.onShift = function (path) {
            expect(path).toEqual('view1');
        };
        shifter.match('view1', view1);
        shifter.shift('view1');
    });
});


describe('shifter.match', function () {

    var view1, shifter;

    beforeEach(function () {

        view1 = new View();
        shifter = new Shifter();
    });

    afterEach(function () {

        view1 = null;
        shifter = null;
    });

    it('partial states should match path', function () {

        var path = shifter.match('path/*', view1);

        expect(path.has('path/')).toBe(true);
        expect(path.has('path/to')).toBe(true);
        expect(path.has('path/to/')).toBe(true);
        expect(path.has('path/to/a')).toBe(true);
        expect(path.has('path/to/a/')).toBe(true);
        expect(path.has('path/to/a/b')).toBe(true);
        expect(path.has('path/to/a/b/')).toBe(true);
        expect(path.has('path/to/a/b/c/')).toBe(true);
    });

    it('partial states should match optional path', function () {

        var path = shifter.match('path/to/:a(/:b)(/:c)', view1);

        expect(path.has('path/to/a')).toBe(true);
        expect(path.has('path/to/a/b')).toBe(true);
        expect(path.has('path/to/a/b/c')).toBe(true);
    });

    it('partial states should not match if not starts with', function () {

        var path = shifter.match('path/to/a/b/c', view1);

        expect(path.has('a/b/c')).toBe(false);
        expect(path.has('to/a/b/c')).toBe(false);
        expect(path.has('b/c')).toBe(false);
        expect(path.has('to/a')).toBe(false);
        expect(path.has('a/b')).toBe(false);
    });

    it('throw an Error if pattern is not a string', function () {
        expect(function(){ shifter.match(/abc/, view1)}).toThrow(new Error('"pattern" must be a string'));
    });
});