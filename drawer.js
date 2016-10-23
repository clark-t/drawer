/**
 * @file drawer.js 抽屉效果动画库
 * @author clarkt(clarktanglei@163.com)
 */

(function () {

    /**
     * drawer constructor
     *
     * @constructor
     * @param {Object} opts params
     * @param {$DOM} opts.$target $target
     * @param {string} opts.direction 'top' or 'bottom' or 'left' or 'right'
     * @param {number} opts.duration duration
     * @param {Object} opts.showOption ways to show wrapper
     * @param {Object=} opts.showOption.add which class or css should be added to show wrapper
     * @param {Array=} opts.showOption.add.class which class should be added to show wrapper
     * @param {Object=} opts.showOption.add.style which class should be added to show wrapper
     * @param {Object=} opts.showOption.remove which class or css should be removed to show wrapper
     * @param {Array=} opts.showOption.remove.class which class should be removed to show wrapper
     * @param {Object=} opts.showOption.remove.style which class should be removed to show wrapper
     * @param {Function=} opts.onChange callback function when state change finishes
     */
    function Drawer(opts) {
        this.processOpts(opts);
        this.status = 'ready';
    }

    var OPTION_MAP = [
        '$target',
        'direction',
        'duration',
        'showOption',
        'onChange'
    ];

    var OPTION_DEFAULT = {
        direction: 'bottom',
        duration: 250
    };

    function getOpts(opts) {
        return OPTION_MAP.reduce(function (res, name) {
            res[name] = opts[name] || OPTION_DEFAULT[name];
            return res;
        }, {});
    }

    Drawer.prototype.processOpts = function (opts) {
        this.opts = getOpts(opts);
        var $target = this.opts.$target;
        var $parent = $target.parent();

        this.$target = $target;
        this.$parent = $parent;
        this._target = _($target[0]);
        this._parent = _($parent[0]);
    };

    // function getDirectionStyleFunction() {

    // }

    Drawer.prototype.show = function () {
        if (this.status !== 'ready' || this._target.css('display') !== 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var direction = me.opts.direction;
        var _target = me._target;
        var _parent = me._parent;

        var originStyle = _target.attr('style') || '';

        var wrapperStyle = {
            width: 0,
            height: 0,
            display: 'none'
        };

        var innerStyle = _parent.getStyle([
            'padding',
            'border',
            'width',
            'height'
        ]);

        innerStyle.margin = _.inverse(innerStyle.padding);

        var targetPosition = _target.css('position');

        if (targetPosition === 'absolute' || targetPosition === 'fixed') {
            wrapperStyle.position = targetPosition;
        }

        var $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        var _wrapper = _($wrapper[0]);
        var _inner = _('.w-drawer-inner', _wrapper);

        // 插入wrapper
        _wrapper.insertAfter(_target);
        _inner.append(_target);

        this.display('show');
        _wrapper.removeStyle('display');

        var isFloat = false;

        if (_target.width() === 0
            && _target.css('display') === 'block'
            && _target.css('float') === 'none'
        ) {
            _target.css('float', 'left');
            isFloat = true;
        }

        if (_target.css('box-sizing') === 'border-box') {
            _target.css(_target.outerSize(true));
        }
        else {
            _target.css(_target.size(true));
        }

        if (isFloat) {
            _target.removeStyle('float');
        }

        if (targetPosition !== 'static') {
            _target.css('position', 'static');
        }

        wrapperStyle = _target.getStyle([
            'display',
            'top',
            'bottom',
            'right',
            'left'
        ]);

        if (targetPosition === 'absolute' || targetPosition === 'fixed') {
            wrapperStyle[direction] = 'auto';
        }

        innerStyle = extend({
                margin: 0,
                padding: 0,
                border: 'none'
            },
            _target.outerSize(true)
        );

        switch (direction) {
            case 'top':
                extend(wrapperStyle, {
                    width: _target.outerWidth(true),
                    height: 0
                });

                extend(innerStyle, {
                        bottom: 0,
                        left: 0
                    },
                    _.prefix('transform', 'translateY(100%)')
                );
                break;
            case 'bottom':
                extend(wrapperStyle, {
                    width: _target.outerWidth(true),
                    height: 0
                });

                extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    _.prefix('transform', 'translateY(-100%)')
                );
                break;
            case 'left':
                extend(wrapperStyle, {
                    width: 0,
                    height: _target.outerHeight(true)
                });

                extend(innerStyle, {
                        top: 0,
                        right: 0
                    },
                    _.prefix('transform', 'translateX(100%)')
                );
                break;
            case 'right':
                extend(wrapperStyle, {
                    width: 0,
                    height: _target.outerHeight(true)
                });

                extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    _.prefix('transform', 'translateX(-100%)')
                );
                break;
            default:
                break;
        }

        _wrapper.css(wrapperStyle);
        _inner.css(innerStyle);

        _inner.on('webkitTransitionEnd transitionend', function (e) {
            _wrapper.replaceWith(_target);
            _target.attr('style', originStyle);
            me.status = 'ready';
            $wrapper = null;
            $inner = null;
            _wrapper = null;
            _inner = null;
        });

        // 动画效果
        var duration = me.opts.duration + 'ms';

        wrapperStyle = _.prefix('transition-duration', duration);
        innerStyle = _.prefix('transition-duration', duration);

        switch (direction) {
            case 'top':
                wrapperStyle.height = _target.outerHeight(true),
                extend(innerStyle, _.prefix('transform', 'translateY(0)'));
                break;
            case 'bottom':
                wrapperStyle.height = _target.outerHeight(true);
                extend(innerStyle, _.prefix('transform', 'translateY(0)'));
                break;
            case 'left':
                wrapperStyle.width = _target.outerWidth(true);
                extend(innerStyle, _.prefix('transform', 'translateX(0)'));
                break;
            case 'right':
                wrapperStyle.width = _target.outerWidth(true);
                extend(innerStyle, _.prefix('transform', 'translateX(0)'));
                break;
            default:
                break;
        }

        _wrapper.css(wrapperStyle);
        _inner.css(innerStyle);
    };

    Drawer.prototype.hide = function () {
        if (this.status !== 'ready' || this._target.css('display') === 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var _target = me._target;
        var originStyle = _target.attr('style') || '';

        var wrapperStyle = extend(_target.getStyle([
                'display',
                'top',
                'right',
                'bottom',
                'left'
            ]),
            _target.outerSize(true)
        );

        var innerStyle = _target.outerSize(true);
        var targetPosition = _target.css('position');

        if (targetPosition !== 'static') {
            wrapperStyle.position = targetPosition;
        }

        var direction = me.opts.direction;

        if (targetPosition === 'absolute' || targetPosition === 'fixed') {
            wrapperStyle[direction] = 'auto';
        }

        switch (direction) {
            case 'top':
                extend(innerStyle, {
                        bottom: 0,
                        left: 0
                    },
                    _.prefix('transform', 'translateY(0)')
                );
                break;
            case 'bottom':
                extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    _.prefix('transform', 'translateY(0)')
                );
                break;
            case 'left':
                extend(innerStyle, {
                        top: 0,
                        right: 0
                    },
                    _.prefix('transform', 'translateX(0)')
                );
                break;
            case 'right':
                extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    _.prefix('transform', 'translatex(0)')
                );
                break;
            default:
                break;
        }

        var $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        _wrapper = _($wrapper[0]);
        _inner = _('.w-drawer-inner', _wrapper);

        var targetStyle = _target.css('box-sizing') === 'border-box'
            ? _target.outerSize(true) : _target.size(true);

        if (targetPosition !== 'static') {
            targetStyle.position = 'static';
        }

        // 插入wrapper
        _wrapper.insertAfter(_target.css(targetStyle));
        _inner.append(_target);
        // @HACK 在完成插入操作后 需要强制触发一次repaint
        // 否则transition有可能不会触发
        _wrapper.height();

        _inner.on('webkitTransitionEnd transitionend', function (e) {
            me.display('hide');
            _wrapper.replaceWith(_target);
            _target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            _wrapper = null;
            _inner = null;
            me.status = 'ready';
        });

        switch (direction) {
            case 'top':
                wrapperStyle = {height: 0};
                innerStyle = _.prefix('transform', 'translateY(100%)');
                break;

            case 'bottom':
                wrapperStyle = {height: 0};
                innerStyle = _.prefix('transform', 'translateY(-100%)');
                break;

            case 'left':
                wrapperStyle = {width: 0};
                innerStyle = _.prefix('transform', 'translateX(100%)');
                break;

            case 'right':
                wrapperStyle = {width: 0};
                innerStyle = _.prefix('transform', 'translateX(-100%)');
                break;

            default:
                break;
        }

        // 动画效果
        var duration = me.opts.duration + 'ms';
        extend(wrapperStyle, _.prefix('transition-duration', duration));
        extend(innerStyle, _.prefix('transition-duration', duration));

        _wrapper.css(wrapperStyle);
        _inner.css(innerStyle);
    };

    Drawer.prototype.toggle = function () {
        if (this.opts.$target.css('display') === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    };

    Drawer.prototype.display = function (type) {
        type = type || 'show';
        var showOption = this.opts.showOption;

        var addOption;
        var removeOption;

        if (type === 'show') {
            addOption = showOption.add;
            removeOption = showOption.remove;
        }
        else {
            addOption = showOption.remove;
            removeOption = showOption.add;
        }

        if (addOption) {
            if (addOption.class) {
                var addClass = addOption.class;

                if (Array.isArray(addClass)) {
                    addClass = addClass.join(' ');
                }

                this._target.addClass(addClass);
            }

            if (addOption.style) {
                this._target.css(addOption.style);
            }
        }

        if (removeOption) {
            if (removeOption.class) {
                var removeClass = removeOption.class;

                if (Array.isArray(removeClass)) {
                    removeClass = removeClass.join(' ');
                }

                this._target.removeClass(removeClass);
            }

            if (removeOption.style) {
                this._target.removeStyle(removeOption.style);
            }
        }
    };

    function getWrapper(styleOpts) {
        // 防止外部定义样式污染
        var defaultStyle = {
            margin: 0,
            padding: 0,
            border: 'none',
            background: 'transparent'
        };

        var wrapperStyle = extend(
            {
                position: 'relative',
                overflow: 'hidden'
            },
            _.prefix('translateZ', 0),
            defaultStyle,
            styleOpts && styleOpts.wrapper
        );

        var innerStyle = extend(
            {position: 'absolute'},
            defaultStyle,
            styleOpts && styleOpts.inner
        );

        return $('<div class="w-drawer-wrapper" '
            + 'style="' + _.stringify(wrapperStyle) + '">'
            + '<div class="w-drawer-inner" '
            + 'style="' + _.stringify(innerStyle) + '">'
            + '</div></div>');
    }

    function extend() {
        if (arguments[0] == null) {
            return arguments[0];
        }

        return Array.prototype.slice.call(arguments, 0)
            .reduce(function (res, ext) {
                if (ext == null) {
                    return res;
                }

                return Object.keys(ext).reduce(function (res, key) {
                    res[key] = ext[key];
                    return res;
                }, res);
            });
    }

    function EL(elem, root) {
        if (typeof elem === 'string') {
            if (elem.slice(0, 1) === '<' && elem.slice(-1) === '>') {
                elem = (new DOMParser()).parseFromString(elem, 'text/xml');
            }
            else {
                elem = (_.getDom(root) || document).querySelector(elem);
            }
        }

        this.dom = elem;
        this.computed = getComputedStyle(elem);
        this.style = elem.style;
    }

    EL.prototype.attr = function (name, val) {
        if (val == null) {
            return this.dom.getAttribute(name);
        }

        this.dom.setAttribute(name, val);
        return this;
    };

    EL.prototype.width = function (ext) {
        ext = ext ? 'px' : 0;

        if (this.computed.boxSizing) {
            return parseFloat(this.computed.width)
                - parseFloat(this.computed.paddingLeft)
                - parseFloat(this.computed.paddingRight)
                + ext;
        }

        return parseFloat(this.computed.width) + ext;
    };

    EL.prototype.height = function (ext) {
        ext = ext ? 'px' : 0;

        if (this.computed.boxSizing) {
            return parseFloat(this.computed.height)
                - parseFloat(this.computed.paddingTop)
                - parseFloat(this.computed.paddingBottom)
                + ext;
        }

        return parseFloat(this.computed.height) + ext;
    };

    EL.prototype.size = function (ext) {
        return {
            width: this.width(ext),
            height: this.height(ext)
        };
    };

    EL.prototype.outerWidth = function (ext) {
        ext = ext ? 'px' : 0;
        return this.dom.clientWidth
            + parseFloat(this.computed.borderLeft)
            + parseFloat(this.computed.borderRight)
            + ext;
    };

    EL.prototype.outerHeight = function (ext) {
        ext = ext ? 'px' : 0;
        return this.dom.clientHeight
            + parseFloat(this.computed.borderTop)
            + parseFloat(this.computed.borderBottom)
            + ext;
    };

    EL.prototype.outerSize = function (ext) {
        return {
            width: this.outerWidth(ext),
            height: this.outerHeight(ext)
        };
    };

    EL.prototype.css = function (name, val) {
        switch (_.instance(name)) {
            case 'String':
                if (val == null) {
                    return this.computed[name];
                }

                this.style[name] = val;
                return this;

            case 'Array':
                if (val === 'remove') {
                    return this.removeStyle(name);
                }

                return this.getStyle(name);

            default:
                return this.addStyle(name);
        }
    };

    EL.prototype.addStyle = function (val) {
        var text = this.attr('style') || '';
        text = !text.length || text.trim().slice(-1) === ';'
            ? text : (text + ';');
        text += Object.keys(val).reduce(function (res, key) {
            return res + key + ':' + val[key] + ';';
        }, '');

        this.attr('style', text);
        return this;
    };

    EL.prototype.getStyle = function (val) {
        return val.reduce(function (res, name) {
            res[name] = this.computed[name];
            return res;
        }.bind(this), {});
    };

    EL.prototype.removeStyle = function (exclude) {
        exclude = typeof exclude === 'string' ? [exclude] : exclude;
        var styleObj = _.parse(this.attr('style') || '');
        var styleStr = Object.keys(styleObj)
            .filter(function (key) {
                return exclude.indexOf(key) === -1;
            })
            .reduce(function (res, key) {
                return res + key + ':' + styleObj[key] + ';';
            }, '');

        this.attr('style', styleStr);
        return this;
    };

    EL.prototype.addClass = function (val) {
        this.dom.className = this.dom.className.trim() + ' ' + val.trim();
        return this;
    };

    EL.prototype.removeClass = function (className) {
        var classText = ' ' + this.dom.className + ' ';

        if (/^ *$/.test(classText)) {
            return this;
        }

        this.dom.className = className.split(' ')
            .reduce(function (res, name) {
                return res.replace(' ' + name + ' ', ' ');
            }, classText)
            .trim();

        return this;
    };

    EL.prototype.insertAfter = function (elem) {
        elem = _.getDom(elem);
        var parent = elem.parentNode;

        if (parent.lastChild === elem) {
            parent.appendChild(this.dom);
        }
        else {
            parent.insertBefore(this.dom, elem.nextSibling);
        }

        return this;
    };

    EL.prototype.append = function (elem) {
        elem = _.getDom(elem);
        this.dom.appendChild(elem);
        return this;
    };

    EL.prototype.replaceWith = function (elem) {
        elem = _.getDom(elem);
        var parent = this.dom.parentNode;
        parent.replaceChild(elem, this.dom);
        return this;
    };

    EL.prototype.on = function (types, callback) {
        (Array.isArray(types) ? types : types.split(' '))
            .forEach(function (type) {
                this.dom.addEventListener(type, callback);
            }.bind(this));
        return this;
    };

    function _(elem, root) {
        if (elem instanceof EL) {
            return elem;
        }

        return new EL(elem, root);
    }

    _.stringify = function (styleObject) {
        return Object.keys(styleObject).reduce(function (res, key) {
            return res + _.dasherize(key) + ':' + styleObject[key] + ';';
        }, '');
    };

    _.parse = function (styleString) {
        return styleString.trim()
            .replace(/ +(;|:) +/g, '$1')
            .replace(/;$/, '')
            .split(';')
            .reduce(function (res, style) {
                    style = style.split(':');
                    res[style[0]] = style[1];
                    return res;
                }, {});
    };

    _.dasherize = function (str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    };

    _.prefix = function (name, value) {
        return ['', '-webkit-'].reduce(function (res, prefix) {
            res[prefix + name] = value;
            return res;
        }, {});
    };

    _.inverse = function (style) {
        return (' ' + style)
            .replace(/( +)(\D?)(\d+)/g, function (str, $1, $2, $3) {
                $2 = !$2 || $2 === '+' ? '-' : '+';
                return $1 + $2 + $3;
            })
            .replace(/^ /, '');
    };

    _.instance = function (val) {
        return Object.prototype.toString.call(val).slice(8, -1);
    };

    _.getDom = function (elem) {
        if (elem instanceof EL) {
            return elem.dom;
        }

        return elem;
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = Drawer;
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
.call(this);
