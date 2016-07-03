(function () {
    /**
     * drawer constructor
     *
     * @param {Object} opts params
     * @param {$DOM} opts.$target $target
     * @param {string} opts.mode 'match-parent' or 'wrap-content' default 'wrap-content'
     * @param {string} opts.direction 'top' or 'bottom' or 'left' or 'right'
     * @param {number} opts.duration duration
     * @param {Object} opts.showOption ways to show wrapper
     * @param {Object=} opts.showOption.add which class or css should be added to show wrapper
     * @param {Array=} opts.showOption.add.class which class should be added to show wrapper
     * @param {Array=} opts.showOption.add.css which class should be added to show wrapper
     * @param {Object=} opts.showOption.remove which class or css should be removed to show wrapper
     * @param {Array=} opts.showOption.remove.class which class should be removed to show wrapper
     * @param {Array=} opts.showOption.remove.css which class should be removed to show wrapper
     */
    function Drawer(opts) {
        this.opts = getOpts(opts);
    }

    Drawer.prototype.show = function () {

    };

    Drawer.prototype.hide = function () {

    };

    Drawer.prototype.toggle = function () {

    };

    var OPTION_MAP = [
        '$target',
        'mode',
        'direction',
        'showOption'
    ];

    function getOpts(opts) {
        var result = {};

        for (var i = 0, max = OPTION_MAP.length; i < max; i++) {
            if (opts[OPTION_MAP[i]] != null) {
                result[OPTION_MAP[i]] = opts[OPTION_MAP[i]];
            }
        }

        return result;
    }

    function getStyle(opts) {
        var $target = opts.$target;
        var $parent = $target.parent();

        var style = {};

        return style;
    }

    // width height
    // position top left right top bottom
    // display
    // float
    function getWrapper() {
        return '<div class="w-drawer-wrapper"><div class="w-drawer-inner"></div></div>';
    }


    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return Drawer;
        });
    }
    else {
        this.Drawer = Drawer;
    }
})
.call(this || typeof window !== 'undefined' ? window : global);
