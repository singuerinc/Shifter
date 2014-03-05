var Shifter;

Shifter = (function () {

    /**
     * Shifter changes view states based on a single path.
     * @constructor
     */
    var Shifter = function () {
        this._currentPath = '';
        this._paths = [];
        return this;
    };

    Shifter.prototype = {
        get currentPath() {
            return this._currentPath;
        }
    };

    /**
     * Called after Shifter changes a state
     * @param {string} path
     */
    Shifter.prototype.onShift;

    /**
     *
     * @param {string} pattern
     * @param view
     * @returns {Shifter.Matcher}
     */
    Shifter.prototype.match = function (pattern, view) {

        if(typeof(pattern) !== 'string'){
            throw new Error('"pattern" must be a string');
        }

        // check if view implements minimal interface
        if (typeof(view['transitionIn']) !== 'function' || typeof(view['transitionOut']) !== 'function') {
            throw new Error('Your view doesn\'t implement transitionIn or transitionOut function.');
        }

        var p = new Shifter.Matcher(pattern, view);
        this._paths.push(p);

        return p;
    };

    /**
     * Change state
     * @param {string} path
     */
    Shifter.prototype.shift = function (path) {
        path = path.replace(/^#[!]?[\/]?/, ''); // remove # or #! from path like #!/foo/bar
        this._exec(path);
        return this;
    };

    /**
     * Execute the change between states
     * @param {string} pattern
     * @private
     */
    Shifter.prototype._exec = function (pattern) {

        var l = this._paths.length;

        var show_views = [], hide_views = [];

        for (var i = 0; i < l; i++) {

            var path = this._paths[i];

            if ((path.has(pattern) && (show_views.indexOf(path._view) === -1)) && !path._view.__shifter_show__) {
                show_views.push(path._view);
            } else if (!path.has(pattern) && (hide_views.indexOf(path._view) === -1) && path._view.__shifter_show__) {
                hide_views.push(path._view);
            }
        }

        for (var j = 0, jl = show_views.length; j < jl; j++) {
            var sv = show_views[j];
            if (!sv.hasOwnProperty('__shifter_init__') && typeof(sv['init']) === 'function') {
                sv.init((function () {
                    this.__shifter_init__ = true;
                    this.transitionIn((function () {
                        this.__shifter_show__ = true;
                    }).bind(this));
                }).bind(sv));
            } else {
                sv.transitionIn((function () {
                    this.__shifter_show__ = true;
                }).bind(sv));
            }
        }

        for (var k = 0, kl = hide_views.length; k < kl; k++) {
            var sh = hide_views[k];
            sh.transitionOut((function () {
                this.__shifter_show__ = false;
            }).bind(sh));
        }

        if (show_views.length > 0) {
            this._currentPath = pattern;
            if (typeof(this.onShift) === 'function') {
                this.onShift(this._currentPath);
                // this.onShift(this._currentPath, params);
            }
        }
    };

    Shifter.Matcher = (function () {

        // "_routeToRegExp" extracted and adapted from Backbone.Router <https://github.com/jashkenas/backbone>
        var optionalParam = /\((.*?)\)/g;
        var namedParam    = /(\(\?)?:\w+/g;
        var splatParam    = /\*/g;
        var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

        var _routeToRegExp = function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        };

        /**
         * @param {string} pattern
         * @param view
         * @constructor
         */
        var Matcher = function (pattern, view) {
            this._re = _routeToRegExp(pattern); // remove # or #! from path like #!/foo/bar;
            this._view = view;
        };

        Matcher.prototype.has = function (pattern) {
            var r = this._re.exec(pattern);
            if(r && r.length > 0) return true;
            return false;
        };

        return Matcher;
    })();

//    if (typeof define === 'function' && define.amd) {
//        define(['Shifter'], function(){
//            return Shifter;
//        });
//    }

    return Shifter;

})();
