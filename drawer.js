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
    };

    // function getDirectionStyleFunction() {

    // }

    Drawer.prototype.show = function () {
        if (this.status !== 'ready' || this.$target.css('display') !== 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var direction = me.opts.direction;
        var $target = me.$target;
        var $parent = me.$parent;

        var originStyle = $target.attr('style') || '';

        var wrapperStyle = {
            width: 0,
            height: 0,
            display: 'none'
        };

        var innerStyle = {
            padding: css($parent[0], 'padding'),
            border: css($parent[0], 'border'),
            width: css($parent[0], 'width'),
            height: css($parent[0], 'height')
        };

        innerStyle.margin = getOppositeStyle(innerStyle.padding);

        var targetPosition = css($target[0], 'position');

        if (targetPosition === 'absolute' || targetPosition === 'fixed') {
            wrapperStyle.position = targetPosition;
        }

        var $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        var $inner = $('.w-drawer-inner', $wrapper);

        // 插入wrapper
        $wrapper.insertAfter($target);
        $inner.append($target);

        processStyle($target, me.opts.showOption, 'show');
        removeStyle($wrapper[0], 'display');

        var isFloat = false;

        if ($target.width() === 0
            && css($target[0], 'display') === 'block'
            && css($target[0], 'float') === 'none'
        ) {
            css($target[0], 'float', 'left');
            isFloat = true;
        }

        if (css($target[0], 'box-sizing') === 'border-box') {
            $target.css({
                width: outerWidth($target[0]) + 'px',
                height: outerHeight($target[0]) + 'px'
            });
        }
        else {
            $target.css({
                width: width($target[0]) + 'px',
                height: height($target[0]) + 'px'
            });
        }

        if (isFloat) {
            removeStyle($target[0], 'float');
        }

        if (targetPosition !== 'static') {
            $target.css('position', 'static');
        }

        wrapperStyle = {
            display: $target.css('display'),
            top: $target.css('top'),
            right: $target.css('right'),
            bottom: $target.css('bottom'),
            left: $target.css('left')
        };

        if (targetPosition === 'absolute' || targetPosition === 'fixed') {
            wrapperStyle[direction] = 'auto';
        }

        innerStyle = {
            width: outerWidth($target[0]) + 'px',
            height: outerHeight($target[0]) + 'px',
            margin: 0,
            padding: 0,
            border: 'none'
        };

        switch (direction) {
            case 'top':
                extend(wrapperStyle, {
                    width: outerWidth($target[0]) + 'px',
                    height: 0
                });

                extend(innerStyle, {
                        bottom: 0,
                        left: 0
                    },
                    getPrefix('transform', 'translateY(100%)'));
                break;
            case 'bottom':
                extend(wrapperStyle, {
                    width: outerWidth($target[0]) + 'px',
                    height: 0
                });

                extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    getPrefix('transform', 'translateY(-100%)'));
                break;
            case 'left':
                extend(wrapperStyle, {
                    width: 0,
                    height: outerHeight($target[0]) + 'px'
                });

                extend(innerStyle, {
                        top: 0,
                        right: 0
                    },
                    getPrefix('transform', 'translateX(100%)'));
                break;
            case 'right':
                extend(wrapperStyle, {
                    width: 0,
                    height: outerHeight($target[0]) + 'px'
                });

                extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    getPrefix('transform', 'translateX(-100%)'));
                break;
            default:
                break;
        }

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);

        me.endEvent($inner, me.opts.duration, function (e) {
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            me.status = 'ready';
            $wrapper = null;
            $inner = null;
        });

        // 动画效果
        var duration = me.opts.duration / 1000 + 's';

        wrapperStyle = getPrefix('transition-duration', duration);
        innerStyle = getPrefix('transition-duration', duration);

        switch (direction) {
            case 'top':
                wrapperStyle.height = outerHeight($target[0]) + 'px',
                extend(innerStyle, getPrefix('transform', 'translateY(0)'));
                break;
            case 'bottom':
                wrapperStyle.height = outerHeight($target[0]) + 'px';
                extend(innerStyle, getPrefix('transform', 'translateY(0)'));
                break;
            case 'left':
                wrapperStyle.width = outerWidth($target[0]) + 'px';
                extend(innerStyle, getPrefix('transform', 'translateX(0)'));
                break;
            case 'right':
                wrapperStyle.width = outerWidth($target[0]) + 'px';
                extend(innerStyle, getPrefix('transform', 'translateX(0)'));
                break;
            default:
                break;
        }

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);
    };

    Drawer.prototype.hide = function () {
        if (this.status !== 'ready' || this.opts.$target.css('display') === 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var $target = me.opts.$target;
        var originStyle = $target.attr('style') || '';

        var wrapperStyle = {
            width: outerWidth($target[0]) + 'px',
            height: outerHeight($target[0]) + 'px',
            display: $target.css('display'),
            top: $target.css('top'),
            right: $target.css('right'),
            bottom: $target.css('bottom'),
            left: $target.css('left')
        };

        var innerStyle = {
            width: outerWidth($target[0]) + 'px',
            height: outerHeight($target[0]) + 'px'
        };

        var targetPosition = $target.css('position');

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
                getPrefix('transform', 'translateY(0)'));
                break;
            case 'bottom':
                extend(innerStyle, {
                    top: 0,
                    left: 0
                },
                getPrefix('transform', 'translateY(0)'));
                break;
            case 'left':
                extend(innerStyle, {
                    top: 0,
                    right: 0
                },
                getPrefix('transform', 'translateX(0)'));
                break;
            case 'right':
                extend(innerStyle, {
                    top: 0,
                    left: 0
                },
                getPrefix('transform', 'translatex(0)'));
                break;
            default:
                break;
        }

        var $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        var $inner = $('.w-drawer-inner', $wrapper);

        var targetStyle;

        if ($target.css('box-sizing') === 'border-box') {
            targetStyle = {
                width: outerWidth($target[0]) + 'px',
                height: outerHeight($target[0]) + 'px'
            };
        }
        else {
            targetStyle = {
                width: width($target[0]) + 'px',
                height: height($target[0]) + 'px'
            };
        }

        if (targetPosition !== 'static') {
            targetStyle.position = 'static';
        }

        // 插入wrapper
        $wrapper.insertAfter($target.css(targetStyle));
        $inner.append($target);
        // @HACK 在完成插入操作后 需要强制触发一次repaint
        // 否则transition有可能不会触发
        height($wrapper[0]);

        me.endEvent($inner, me.opts.duration, function (e) {
            processStyle($target, me.opts.showOption, 'hide');
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            me.status = 'ready';
        });

        switch (direction) {
            case 'top':
                wrapperStyle = {
                    height: 0
                };

                innerStyle = getPrefix('transform', 'translateY(100%)');
                break;

            case 'bottom':
                wrapperStyle = {
                    height: 0
                };

                innerStyle = getPrefix('transform', 'translateY(-100%)');
                break;

            case 'left':
                wrapperStyle = {
                    width: 0
                };

                innerStyle = getPrefix('transform', 'translateX(100%)');
                break;

            case 'right':
                wrapperStyle = {
                    width: 0
                };

                innerStyle = getPrefix('transform', 'translateX(-100%)');
                break;

            default:
                break;
        }

        // 动画效果
        var duration = me.opts.duration / 1000 + 's';
        extend(wrapperStyle, getPrefix('transition-duration', duration));
        extend(innerStyle, getPrefix('transition-duration', duration));

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);
    };

    Drawer.prototype.toggle = function () {
        if (this.opts.$target.css('display') === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    };

    // 坑爹的transitionend不一定会触发 因此需要用个timer去做控制
    // 参考自zepto anim方法
    Drawer.prototype.endEvent = function ($dom, duration, callback) {
        var fired = false;

        if (duration > 0) {
            $dom.on('webkitTransitionEnd transitionend', function (e) {
                if (fired) {
                    return;
                }

                fired = true;
                callback && callback(e);
            });

            setTimeout(function (e) {
                if (fired) {
                    return;
                }

                fired = true;
                callback && callback(e);
            }, duration + 25);
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
            getPrefix('translateZ', 0),
            defaultStyle,
            styleOpts && styleOpts.wrapper
        );

        var innerStyle = extend(
            {position: 'absolute'},
            defaultStyle,
            styleOpts && styleOpts.inner
        );

        return $('<div class="w-drawer-wrapper" '
            + 'style="' + getStyleString(wrapperStyle) + '">'
            + '<div class="w-drawer-inner" '
            + 'style="' + getStyleString(innerStyle) + '">'
            + '</div></div>');
    }

    function getStyleString(styleObject) {
        return Object.keys(styleObject).reduce(function (res, key) {
            return res + dasherize(key) + ':' + styleObject[key] + ';';
        }, '');
    }

    function parseStyleString(styleString) {
        return styleString.trim()
            .replace(/ +(;|:) +/g, '$1')
            .replace(/;$/, '')
            .split(';')
            .reduce(function (res, style) {
                    style = style.split(':');
                    res[style[0]] = style[1];
                    return res;
                }, {});
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

    function removeStyle(elem, exclude) {
        exclude = typeof exclude === 'string' ? [exclude] : exclude;
        var styleObj = parseStyleString(elem.getAttribute('style') || '');
        var styleStr = Object.keys(styleObj)
            .filter(function (key) {
                return exclude.indexOf(key) === -1;
            })
            .reduce(function (res, key) {
                return res + key + ':' + styleObj[key] + ';';
            }, '');

        elem.setAttribute('style', styleStr);
    }

    var PREFIX = ['', '-webkit-'];

    function getPrefix(name, value) {
        return PREFIX.reduce(function (res, prefix) {
            res[prefix + name] = value;
            return res;
        }, {});
    }

    function getOppositeStyle(style) {
        return (' ' + style)
            .replace(/( +)(\D?)(\d+)/g, function (str, $1, $2, $3) {
                $2 = !$2 || $2 === '+' ? '-' : '+';
                return $1 + $2 + $3;
            })
            .replace(/^ /, '');
    }

    function processStyle($dom, showOption, type) {
        type = type || 'show';

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

                $dom.addClass(addClass);
            }

            if (addOption.style) {
                $dom.css(addOption.style);
            }
        }

        if (removeOption) {
            if (removeOption.class) {
                var removeClass = removeOption.class;

                if (Array.isArray(removeClass)) {
                    removeClass = removeClass.join(' ');
                }

                $dom.removeClass(removeClass);
            }

            if (removeOption.style) {
                removeStyle($dom[0], removeOption.style);
            }
        }
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

    function outerWidth(elem, computed) {
        computed = computed || getComputedStyle(elem);
        return elem.clientWidth
            + parseFloat(computed.borderLeft)
            + parseFloat(computed.borderRight);
    }

    function outerHeight(elem, computed) {
        computed = computed || getComputedStyle(elem);
        return elem.clientHeight
            + parseFloat(computed.borderTop)
            + parseFloat(computed.borderBottom);
    }

    function width(elem, computed) {
        computed = computed || getComputedStyle(elem);
        return parseFloat(computed.width);
    }

    function height(elem, computed) {
        computed = computed || getComputedStyle(elem);
        return parseFloat(computed.height);
    }

    function css(elem, name, val) {
        if (typeof name === 'string') {
            if (val == null) {
                var computed = getComputedStyle(elem);
                return computed[name];
            }

            elem.style[name] = val;
            return;
        }

        var text = elem.getAttribute('style') || '';
        text = !text.length || text.trim().slice(-1) === ';'
            ? text : (text + ';');
        text += Object.keys(name).reduce(function (res, key) {
            return res + key + ':' + name[key] + ';';
        }, '');

        elem.getAttribute('style', text);
    }

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
