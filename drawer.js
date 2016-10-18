/**
 * @file drawer.js 抽屉效果动画库
 * @author clarkt(clarktanglei@163.com)
 */

(function () {

    /**
     * drawer constructor
     *
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
        this.opts = getOpts(opts);
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

    // Drawer.prototype.processOpts = function () {
    //     var me = this;
    //     var $target = me.opts.$target;
    //     var $parent = $target.parent();
    // };

    // function getDirectionStyle() {

    // }

    Drawer.prototype.show = function () {
        if (this.status !== 'ready' || this.opts.$target.css('display') !== 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var direction = me.opts.direction;
        var $target = me.opts.$target;
        var $parent = $target.parent();

        var originStyle = $target.attr('style') || '';

        var wrapperStyle = {
            width: 0,
            height: 0,
            display: 'none'
        };

        var innerStyle = {
            padding: $parent.css('padding'),
            border: $parent.css('border'),
            width: $parent.css('width'),
            height: $parent.css('height')
        };

        innerStyle.margin = (' ' + innerStyle.padding)
            .replace(/( +)(\D?)(\d+)/g, function (str, $1, $2, $3) {
                $2 = !$2 || $2 === '+' ? '-' : '+';
                return $1 + $2 + $3;
            })
            .replace(/^ /, '');

        var targetPosition = $target.css('position');

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
        removeStyle($wrapper, 'display');

        var isFloat = false;

        if ($target.width() === 0
            && $target.css('display') === 'block'
            && $target.css('float') === 'none'
        ) {
            $target.css('float', 'left');
            isFloat = true;
        }

        if ($target.css('box-sizing') === 'border-box') {
            $target.css({
                width: $target.outerWidth() + 'px',
                height: $target.outerHeight() + 'px'
            });
        }
        else {
            $target.css({
                width: $target.width() + 'px',
                height: $target.height() + 'px'
            });
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
            width: $target.outerWidth() + 'px',
            height: $target.outerHeight() + 'px',
            margin: 0,
            padding: 0,
            border: 'none'
        };

        if (isFloat) {
            removeStyle($target, 'float');
        }

        switch (direction) {
            case 'top':
                $.extend(wrapperStyle, {
                    width: $target.outerWidth() + 'px',
                    height: 0
                });

                $.extend(innerStyle, {
                        bottom: 0,
                        left: 0
                    },
                    getPrefix('transform', 'translateY(100%)'));
                break;
            case 'bottom':
                $.extend(wrapperStyle, {
                    width: $target.outerWidth() + 'px',
                    height: 0
                });

                $.extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    getPrefix('transform', 'translateY(-100%)'));
                break;
            case 'left':
                $.extend(wrapperStyle, {
                    width: 0,
                    height: $target.outerHeight() + 'px'
                });

                $.extend(innerStyle, {
                        top: 0,
                        right: 0
                    },
                    getPrefix('transform', 'translateX(100%)'));
                break;
            case 'right':
                $.extend(wrapperStyle, {
                    width: 0,
                    height: $target.outerHeight() + 'px'
                });

                $.extend(innerStyle, {
                        top: 0,
                        left: 0
                    },
                    getPrefix('transform', 'translateX(-100%)'));
                break;
            default:
                break;
        }

        if (targetPosition !== 'static') {
            $target.css('position', 'static');
        }

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);

        // 动画效果
        var duration = me.opts.duration / 1000 + 's';

        wrapperStyle = getPrefix('transition', duration);
        innerStyle = getPrefix('transition', duration);

        me.endEvent($inner, me.opts.duration, function (e) {
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            me.status = 'ready';
            $wrapper = null;
            $inner = null;
        });

        setTimeout(function () {
            switch (direction) {
                case 'top':
                    wrapperStyle.height = $target.outerHeight() + 'px';
                    $.extend(innerStyle, getPrefix('transform', 'translateY(0)'));
                    break;
                case 'bottom':
                    wrapperStyle.height = $target.outerHeight() + 'px';
                    $.extend(innerStyle, getPrefix('transform', 'translateY(0)'));
                    break;
                case 'left':
                    wrapperStyle.width = $target.outerWidth() + 'px';
                    $.extend(innerStyle, getPrefix('transform', 'translateX(0)'));
                    break;
                case 'right':
                    wrapperStyle.width = $target.outerWidth() + 'px';
                    $.extend(innerStyle, getPrefix('transform', 'translateX(0)'));
                    break;
                default:
                    break;
            }

            $wrapper.css(wrapperStyle);
            $inner.css(innerStyle);
        });
    };

    Drawer.prototype.hide = function () {
        if (this.status !== 'ready' || this.opts.$target.css('display') === 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var $target = me.opts.$target;
        var originStyle = $target.attr('style') || '';
        // 动画效果
        var duration = me.opts.duration / 1000 + 's';

        var wrapperStyle = $.extend(
            {
                width: $target.outerWidth() + 'px',
                height: $target.outerHeight() + 'px',
                display: $target.css('display'),
                top: $target.css('top'),
                right: $target.css('right'),
                bottom: $target.css('bottom'),
                left: $target.css('left')
            },
            getPrefix('transition', duration)
        );

        var innerStyle = $.extend(
            {
                width: $target.outerWidth() + 'px',
                height: $target.outerHeight() + 'px'
            },
            getPrefix('transition', duration)
        );

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
                $.extend(innerStyle, {
                    bottom: 0,
                    left: 0
                },
                getPrefix('transform', 'translateY(0)'));
                break;
            case 'bottom':
                $.extend(innerStyle, {
                    top: 0,
                    left: 0
                },
                getPrefix('transform', 'translateY(0)'));
                break;
            case 'left':
                $.extend(innerStyle, {
                    top: 0,
                    right: 0
                },
                getPrefix('transform', 'translateX(0)'));
                break;
            case 'right':
                $.extend(innerStyle, {
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
                width: $target.outerWidth() + 'px',
                height: $target.outerHeight() + 'px'
            };
        }
        else {
            targetStyle = {
                width: $target.css('width'),
                height: $target.css('height')
            };
        }

        // 插入wrapper
        $wrapper.insertAfter($target.css(targetStyle));
        $inner.append($target);

        if (targetPosition !== 'static') {
            $target.css('position', 'static');
        }

        me.endEvent($inner, me.opts.duration, function (e) {
            processStyle($target, me.opts.showOption, 'hide');
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            me.status = 'ready';
        });

        setTimeout(function () {
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

            $wrapper.css(wrapperStyle);
            $inner.css(innerStyle);
        });
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

        var wrapperStyle = $.extend(
            {
                position: 'relative',
                overflow: 'hidden'
            },
            getPrefix('translateZ', 0),
            defaultStyle,
            styleOpts && styleOpts.wrapper
        );

        var innerStyle = $.extend(
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
                },
                {}
            );
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

    function removeStyle($dom, exclude) {
        exclude = typeof exclude === 'string' ? [exclude] : exclude;
        var styleObj = parseStyleString($dom.attr('style') || '');
        var styleStr = Object.keys(styleObj)
            .filter(function (key) {
                return exclude.indexOf(key) === -1;
            })
            .reduce(function (res, key) {
                return res + key + ':' + styleObj[key] + ';';
            }, '');

        $dom.attr('style', styleStr);
    }

    var PREFIX = ['', '-webkit-'];

    function getPrefix(name, value) {
        return PREFIX.reduce(function (res, prefix) {
            res[prefix + name] = value;
            return res;
        }, {});
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
                removeStyle($dom, removeOption.style);
            }
        }
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
