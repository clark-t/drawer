/**
 * @file drawer.js 抽屉效果动画库
 * @author clarkt(clarktanglei@163.com)
 */

import $ from 'ui-query';
const px = true;

export default class Drawer {
    constructor({
        target,
        direction = 'bottom',
        duration = 250,
        timingFunction = 'ease',
        showOption,
        onChange = () => {}
    }) {

        $.extend(this, {
            direction,
            duration,
            timingFunction,
            showOption,
            onChange
        });

        const transition = $.prefix('transition', `${duration}ms ${timingFunction}`);

        this.$target = $(target);
        this.$parent = this.$target.parent();
        this.getShowStartStyle = getShowStartStyle(direction);
        this.getShowEndStyle = getShowEndStyle(direction, transition);
        this.getHideStartStyle = getHideStartStyle(direction);
        this.hideEndStyle = getHideEndStyle(direction, transition);
        this.status = 'ready';
    }

    show() {
        if (this.status !== 'ready' || this.$target.css('display') !== 'none') {
            return;
        }

        this.status = 'pending';

        const $target = this.$target;

        let originStyle = $target.attr('style') || '';

        let $wrapper = getWrapper(getShowInitStyle($target, this.$parent));
        let $inner = $('.w-drawer-inner', $wrapper);

        // 插入wrapper
        $wrapper.insertAfter($target);
        $inner.append($target);

        display($target, this.showOption, 'show');
        $wrapper.removeStyle('display');

        adjustShowTarget($target);

        let {
            wrapper: wrapperStart,
            inner: innerStart
        } = this.getShowStartStyle($target);
        $wrapper.css(wrapperStart);
        $inner.css(innerStart);

        $inner.on('webkitTransitionEnd transitionend', () => {
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            this.status = 'ready';
            this.onChange('show');
        });

        let {
            wrapper: wrapperEnd,
            inner: innerEnd
        } = this.getShowEndStyle($target);
        $wrapper.css(wrapperEnd);
        $inner.css(innerEnd);
    }

    hide() {
        if (this.status !== 'ready' || this.$target.css('display') === 'none') {
            return;
        }

        this.status = 'pending';
        const $target = this.$target;
        let originStyle = $target.attr('style') || '';

        let $wrapper = getWrapper(this.getHideStartStyle($target));
        let $inner = $('.w-drawer-inner', $wrapper);

        adjustHideTarget($target);

        // 插入wrapper
        $wrapper.insertAfter($target);
        $inner.append($target);
        // @HACK 在完成插入操作后 需要强制触发一次repaint
        // 否则transition有可能不会触发
        $wrapper.height();

        $inner.on('webkitTransitionEnd transitionend', () => {
            display($target, this.showOption, 'hide');
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            this.status = 'ready';
            this.onChange('hide');
        });

        let {wrapper, inner} = this.hideEndStyle;
        $wrapper.css(wrapper);
        $inner.css(inner);
    }

    toggle() {
        if (this.$target.css('display') === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    }
}

function getShowInitStyle($target, $parent) {
    let wrapper = {
        width: 0,
        height: 0,
        display: 'none'
    };

    let position = $target.css('position');

    if (['absolute', 'fixed'].indexOf(position) > -1) {
        wrapper.position = position;
    }

    let inner = $parent.getStyle([
        'padding',
        'border',
        'width',
        'height'
    ]);

    inner.margin = $.inverse(inner.padding);

    return {wrapper, inner};
}

function adjustShowTarget($target) {
    let isFloat = false;

    if ($target.width() === 0
        && $target.css('display') === 'block'
        && $target.css('float') === 'none'
    ) {
        $target.css('float', 'left');
        isFloat = true;
    }

    if ($target.css('box-sizing') === 'border-box') {
        $target.css($target.outerSize(px));
    }
    else {
        $target.css($target.size(px));
    }

    if (isFloat) {
        $target.removeStyle('float');
    }

    if ($target.css('position') !== 'static') {
        $target.css('position', 'static');
    }
}

function getShowStartDirectionStyle(direction) {
    switch (direction) {
        case 'top':
            return $target => ({
                wrapper: {
                    width: $target.outerWidth(px),
                    height: 0
                },
                inner: $.extend(
                    {
                        bottom: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateY(100%)')
                )
            });

        case 'bottom':
            return $target => ({
                wrapper: {
                    width: $target.outerWidth(px),
                    height: 0
                },
                inner: $.extend(
                    {
                        top: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateY(-100%)')
                )
            });

        case 'left':
            return $target => ({
                wrapper: {
                    width: 0,
                    height: $target.outerHeight(px)
                },
                inner: $.extend(
                    {
                        top: 0,
                        right: 0
                    },
                    $.prefix('transform', 'translateX(100%)')
                )
            });

        case 'right':
            return $target => ({
                wrapper: {
                    width: 0,
                    height: $target.outerHeight(px)
                },
                inner: $.extend(
                    {
                        top: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateX(-100%)')
                )
            });

        default:
            break;
    }
}

function getShowStartStyle(direction) {
    let getDirectionStyle = getShowStartDirectionStyle(direction);

    return $target => {
        let {wrapper, inner} = getDirectionStyle($target);

        $.extend(
            wrapper,
            $target.getStyle([
                'display',
                'top',
                'bottom',
                'right',
                'left'
            ])
        );

        if (['absolute', 'fixed'].indexOf($target.css('position')) > -1) {
            wrapper[direction] = 'auto';
        }

        $.extend(
            inner,
            {
                margin: 0,
                padding: 0,
                border: 'none'
            },
            $target.outerSize(px)
        );

        return {wrapper, inner};
    };
}

function getShowEndStyle(direction, transition) {
    let inner;

    switch (direction) {
        case 'top':
        case 'bottom':
            inner = $.extend(
                $.prefix('transform', 'translateY(0)'),
                transition
            );

            return $target => ({
                wrapper: $.extend(
                    {
                        height: $target.outerHeight(px)
                    },
                    transition
                ),
                inner: inner
            });

        case 'left':
        case 'right':
            inner = $.extend(
                $.prefix('transform', 'translateX(0)'),
                transition
            );

            return $target => ({
                wrapper: $.extend(
                    {
                        width: $target.outerWidth(px)
                    },
                    transition
                ),
                inner: inner
            });

        default:
            break;
    }
}

function adjustHideTarget($target) {
    let style = $target.css('box-sizing') === 'border-box'
        ? $target.outerSize(px) : $target.size(px);

    if ($target.css('position') !== 'static') {
        style.position = 'static';
    }

    $target.css(style);
}

function getHideStartStyle(direction) {
    let inner;

    switch (direction) {
        case 'top':
            inner = $.extend(
                {
                    bottom: 0,
                    left: 0
                },
                $.prefix('transform', 'translateY(0)')
            );
            break;

        case 'bottom':
            inner = $.extend(
                {
                    top: 0,
                    left: 0
                },
                $.prefix('transform', 'translateY(0)')
            );
            break;

        case 'left':
            inner = $.extend(
                {
                    top: 0,
                    right: 0
                },
                $.prefix('transform', 'translateX(0)')
            );
            break;

        case 'right':
            inner = $.extend(
                {
                    top: 0,
                    left: 0
                },
                $.prefix('transform', 'translatex(0)')
            );
            break;

        default:
            break;
    }

    return $target => {
        let outerSize = $target.outerSize(px);
        let wrapper = $.extend(
            $target.getStyle([
                'display',
                'top',
                'right',
                'bottom',
                'left'
            ]),
            outerSize
        );

        let position = $target.css('position');

        if (position !== 'static') {
            wrapper.position = position;
        }

        if (['absolute', 'fixed'].indexOf(position) > -1) {
            wrapper[direction] = 'auto';
        }

        return {
            wrapper: wrapper,
            inner: $.extend({}, outerSize, inner)
        };
    };
}

function getHideEndStyle(direction, transition) {
    let wrapper;
    let inner;

    switch (direction) {
        case 'top':
            wrapper = {height: 0};
            inner = $.prefix('transform', 'translateY(100%)');
            break;

        case 'bottom':
            wrapper = {height: 0};
            inner = $.prefix('transform', 'translateY(-100%)');
            break;

        case 'left':
            wrapper = {width: 0};
            inner = $.prefix('transform', 'translateX(100%)');
            break;

        case 'right':
            wrapper = {width: 0};
            inner = $.prefix('transform', 'translateX(-100%)');
            break;

        default:
            break;
    }

    $.extend(wrapper, transition);
    $.extend(inner, transition);
    return {wrapper, inner};
}

const defaultStyle = {
    margin: 0,
    padding: 0,
    border: 'none',
    background: 'transparent'
};

function getWrapper({wrapper, inner}) {
    wrapper = $.extend(
        {position: 'relative', overflow: 'hidden'},
        $.prefix('translateZ', 0),
        defaultStyle,
        wrapper
    );
    inner = $.extend({position: 'absolute'}, defaultStyle, inner);

    return $(`
        <div class="w-drawer-wrapper" style="${$.stringify(wrapper)}">
            <div class="w-drawer-inner" style="${$.stringify(inner)}">
            </div>
        </div>
    `);
}

function display($target, showOption, type = 'show') {
    let [addOption, removeOption] = type === 'show'
        ? [showOption.add, showOption.remove]
        : [showOption.remove, showOption.add];

    if (addOption) {
        if (addOption.class) {
            let classes = addOption.class;

            if (Array.isArray(classes)) {
                classes = classes.join(' ');
            }

            $target.addClass(classes);
        }

        if (addOption.style) {
            $target.css(addOption.style);
        }
    }

    if (removeOption) {
        if (removeOption.class) {
            let classes = removeOption.class;

            if (Array.isArray(classes)) {
                classes = classes.join(' ');
            }

            $target.removeClass(classes);
        }

        if (removeOption.style) {
            $target.removeStyle(removeOption.style);
        }
    }
}
