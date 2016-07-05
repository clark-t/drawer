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
        var result = {};

        for (var i = 0, max = OPTION_MAP.length; i < max; i++) {
            if (opts[OPTION_MAP[i]] != null) {
                result[OPTION_MAP[i]] = opts[OPTION_MAP[i]];
            }
            else if (OPTION_DEFAULT[OPTION_MAP[i]] != null) {
                result[OPTION_MAP[i]] = OPTION_DEFAULT[OPTION_MAP[i]];
            }
        }

        return result;
    }

    Drawer.prototype.show = function () {
        if (this.status !== 'ready'
            || this.opts.$target.css('display') !== 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var direction = me.opts.direction;
        var $target = me.opts.$target;
        var $parent = $target.parent();

        var wrapperStyle = {
            width: 0,
            height: 0,
            overflow: 'hidden',
            position: 'relative',
            display: 'none'
        };

        var innerStyle = {
            position: 'absolute'
        };

        var targetPosition = $target.css('position');

        if (targetPosition === 'absolute' || targetPosition === 'fixed') {
            innerStyle.width = $parent.outerWidth() + 'px';
        }
        else {
            innerStyle.width = $parent.width() + 'px';
        }

        innerStyle.height = $parent.outerHeight() + 'px';

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

        var originStyle = $target.attr('style');

        if ($target.css('box-sizing') === 'border-box') {
            $target.css({
                width: $target.outerWidth() + 'px',
                height: $target.outerHeight() + 'px'
            });
        }
        else {
            $target.css({
                width: $target.outerWidth() + 'px',
                height: $target.outerHeight() + 'px'
            });
        }

        var wrapperStyle = {
            display: $target.css('display'),
            top: $target.css('top'),
            right: $target.css('right'),
            bottom: $target.css('bottom'),
            left: $target.css('left')
        };

        var innerStyle = {
            width: $target.outerWidth() + 'px',
            height: $target.outerHeight() + 'px'
        };

        if (targetPosition !== 'static') {
            wrapperStyle.position = $target.css('position');
        }
        else {
             wrapperStyle.position = 'relative';
            $target.css('position', 'static');
        }

        switch (direction) {
            case 'top':
                $.extend(wrapperStyle, {
                    width: $target.outerWidth() + 'px',
                    height: 0
                });

                if ($target.css('position') === 'absolute'
                    || $target.css('position') === 'fixed') {
                    wrapperStyle.top = 'auto';
                }

                $.extend(innerStyle, {
                    'bottom': 0,
                    'left': 0,
                    '-webkit-transform': 'translateY(100%)',
                    'transform': 'translateY(100%)'
                });
                break;
            case 'right':
                break;
            case 'bottom':
                $.extend(wrapperStyle, {
                    width: $target.outerWidth() + 'px',
                    height: 0
                });

                if ($target.css('position') === 'absolute'
                    || $target.css('position') === 'fixed') {
                    wrapperStyle.bottom = 'auto';
                }

                $.extend(innerStyle, {
                    'top': 0,
                    'left': 0,
                    '-webkit-transform': 'translateY(-100%)',
                    'transform': 'translateY(-100%)'
                });
                break;
            case 'left':
                break;
            default:
                break;
        }

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);

        // 动画效果
        var duration = me.opts.duration / 1000 + 's';

        wrapperStyle = {
            '-webkit-transition': duration,
            'transition': duration
        };

        innerStyle = {
            '-webkit-transition': duration,
            'transition': duration
        };

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
                    $.extend(innerStyle, {
                        '-webkit-transform': 'translateY(0)',
                        'transform': 'translateY(0)'
                    });
                    break;
                case 'bottom':
                    wrapperStyle.height = $target.outerHeight() + 'px';
                    $.extend(innerStyle, {
                        '-webkit-transform': 'translateY(0)',
                        'transform': 'translateY(0)'
                    });
                    break;
                default:
                    break;
            }

            $wrapper.css(wrapperStyle);
            $inner.css(innerStyle);
        }, 1);
    };

    Drawer.prototype.hide = function () {
        if (this.status !== 'ready'
            || this.opts.$target.css('display') === 'none') {
            return;
        }

        var me = this;
        me.status = 'pending';
        var $target = me.opts.$target;

        var originStyle = $target.attr('style');
        // 动画效果
        var duration = me.opts.duration / 1000 + 's';

        var wrapperStyle = {
            width: $target.outerWidth() + 'px',
            height: $target.outerHeight() + 'px',
            display: $target.css('display'),
            top: $target.css('top'),
            right: $target.css('right'),
            bottom: $target.css('bottom'),
            left: $target.css('left'),
            overflow: 'hidden'
        };

        var innerStyle = {
            width: $target.outerWidth() + 'px',
            height: $target.outerHeight() + 'px',
            position: 'absolute',
            '-webkit-transition': duration,
            transition: duration
        };

        if ($target.css('position') !== 'static') {
            wrapperStyle.position = $target.css('position');
        }
        else {
             wrapperStyle.position = 'relative';
        }

        var direction = me.opts.direction;

        switch (direction) {
            case 'top':
                $.extend(innerStyle, {
                    'bottom': 0,
                    'left': 0,
                    '-webkit-transform': 'translateY(0)',
                    'transform': 'translateY(0)'
                });

                if ($target.css('position') === 'absolute'
                    || $target.css('position') === 'fixed') {
                    wrapperStyle.top = 'auto';
                }
                break;
            case 'right':
                break;
            case 'bottom':
                $.extend(innerStyle, {
                    'top': 0,
                    'left': 0,
                    '-webkit-transform': 'translateY(0)',
                    'transform': 'translateY(0)'
                });

                if ($target.css('position') === 'absolute'
                    || $target.css('position') === 'fixed') {
                    wrapperStyle.bottom = 'auto';
                }
                break;
            case 'left':
                break;
            default:
                break;
        }

        var $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        var $inner = $('.w-drawer-inner', $wrapper);

        var targetStyle = {
            position: 'static',
            width: $target.css('width'),
            height: $target.css('height')
        };
        // 插入wrapper
        $wrapper.insertAfter($target.css(targetStyle));
        $inner.append($target);

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
                        '-webkit-transition': duration,
                        'transition': duration,
                        'height': 0
                    };

                    innerStyle = {
                        '-webkit-transition': duration,
                        'transition': duration,
                        '-webkit-transform': 'translateY(100%)',
                        'transform': 'translateY(100%)'
                    };
                    break;
                case 'bottom':
                    wrapperStyle = {
                        '-webkit-transition': duration,
                        'transition': duration,
                        'height': 0
                    };

                    innerStyle = {
                        '-webkit-transition': duration,
                        'transition': duration,
                        '-webkit-transform': 'translateY(-100%)',
                        'transform': 'translateY(-100%)'
                    };
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
        var defaultStyle = {
            margin: 0,
            padding: 0,
            border: 'none',
            background: 'transparent'
        };

        var wrapperStyle = $.extend({}, defaultStyle, styleOpts && styleOpts.wrapper);
        var innerStyle = $.extend({}, defaultStyle, styleOpts && styleOpts.inner);

        // 防止外部定义样式污染
        return $('<div class="w-drawer-wrapper" '
            + 'style="' + getStyleString(wrapperStyle) + '">'
            + '<div class="w-drawer-inner" '
            + 'style="' + getStyleString(innerStyle) + '">'
            + '</div></div>');
    }

    function getStyleString(styleObject) {
        var str = '';

        for (var key in styleObject) {
            if (styleObject.hasOwnProperty(key)) {
                str += dasherize(key) + ':' + styleObject[key] + ';';
            }
        }

        return str;
    }

    function parseStyleString(styleString) {
        styleString = styleString
            .trim()
            .replace(/ +(;|:) +/g, '$1')
            .replace(/;$/, '');
        var styleStringList = styleString.split(';');

        var styleObj = {};

        for (var i = 0, max = styleStringList.length; i < max; i++) {
            var style = styleStringList[i].split(':');
            styleObj[style[0]] = style[1];
        }

        return styleObj;
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase();
    }

    function removeStyle($dom, excludeList) {
        if (typeof excludeList === 'string') {
            excludeList = [excludeList];
        }

        var styleObj = parseStyleString($dom.attr('style'));
        var styleStr = '';

        for (var key in styleObj) {
            if (styleObj.hasOwnProperty(key)
                && excludeList.indexOf(key) === -1) {
                styleStr += key + ':' + styleObj[key] + ';';
            }
        }

        $dom.attr('style', styleStr);
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

                if (addClass instanceof Array) {
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

                if (removeClass instanceof Array) {
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
.call(this || typeof window !== 'undefined' ? window : global);
