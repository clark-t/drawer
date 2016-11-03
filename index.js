/**
 * @file drawer.js 抽屉效果动画库
 * @author clarkt(clarktanglei@163.com)
 */

import $ from 'ui-query';

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

        this.$target = $(target);
        this.$parent = this.$target.parent();
        this.status = 'ready';
    }

    show() {
        if (this.status !== 'ready' || this.$target.css('display') !== 'none') {
            return;
        }

        this.status = 'pending';
        const direction = this.direction;
        const $target = this.$target;

        let originStyle = $target.attr('style') || '';

        let wrapperStyle = {
            width: 0,
            height: 0,
            display: 'none'
        };

        let targetPosition = $target.css('position');

        if (['absolute', 'fixed'].indexOf(targetPosition) > -1) {
            wrapperStyle.position = targetPosition;
        }

        let innerStyle = this.$parent.getStyle([
            'padding',
            'border',
            'width',
            'height'
        ]);

        innerStyle.margin = $.inverse(innerStyle.padding);

        let $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        let $inner = $('.w-drawer-inner', $wrapper);

        // 插入wrapper
        $wrapper.insertAfter($target);
        $inner.append($target);

        this.display('show');
        $wrapper.removeStyle('display');

        let isFloat = false;

        if ($target.width() === 0
            && $target.css('display') === 'block'
            && $target.css('float') === 'none'
        ) {
            $target.css('float', 'left');
            isFloat = true;
        }

        if ($target.css('box-sizing') === 'border-box') {
            $target.css($target.outerSize(true));
        }
        else {
            $target.css($target.size(true));
        }

        if (isFloat) {
            $target.removeStyle('float');
        }

        if (targetPosition !== 'static') {
            $target.css('position', 'static');
        }

        wrapperStyle = $target.getStyle([
            'display',
            'top',
            'bottom',
            'right',
            'left'
        ]);

        if (['absolute', 'fixed'].indexOf(targetPosition) > -1) {
            wrapperStyle[direction] = 'auto';
        }

        innerStyle = $.extend({
                margin: 0,
                padding: 0,
                border: 'none'
            },
            $target.outerSize(true)
        );

        switch (direction) {
            case 'top':
                $.extend(
                    wrapperStyle,
                    {
                        width: $target.outerWidth(true),
                        height: 0
                    }
                );

                $.extend(
                    innerStyle,
                    {
                        bottom: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateY(100%)')
                );
                break;
            case 'bottom':
                $.extend(
                    wrapperStyle,
                    {
                        width: $target.outerWidth(true),
                        height: 0
                    }
                );

                $.extend(
                    innerStyle,
                    {
                        top: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateY(-100%)')
                );
                break;
            case 'left':
                $.extend(
                    wrapperStyle,
                    {
                        width: 0,
                        height: $target.outerHeight(true)
                    }
                );

                $.extend(
                    innerStyle,
                    {
                        top: 0,
                        right: 0
                    },
                    $.prefix('transform', 'translateX(100%)')
                );
                break;
            case 'right':
                $.extend(
                    wrapperStyle,
                    {
                        width: 0,
                        height: $target.outerHeight(true)
                    }
                );

                $.extend(
                    innerStyle,
                    {
                        top: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateX(-100%)')
                );
                break;
            default:
                break;
        }

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);

        $inner.on('webkitTransitionEnd transitionend', () => {
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            this.status = 'ready';
            this.onChange('show');
        });

        // 动画效果
        let transition = `${this.duration}ms ${this.timingFunction}`;

        wrapperStyle = $.prefix('transition', transition);
        innerStyle = $.prefix('transition', transition);

        switch (direction) {
            case 'top':
                wrapperStyle.height = $target.outerHeight(true),
                $.extend(innerStyle, $.prefix('transform', 'translateY(0)'));
                break;
            case 'bottom':
                wrapperStyle.height = $target.outerHeight(true);
                $.extend(innerStyle, $.prefix('transform', 'translateY(0)'));
                break;
            case 'left':
                wrapperStyle.width = $target.outerWidth(true);
                $.extend(innerStyle, $.prefix('transform', 'translateX(0)'));
                break;
            case 'right':
                wrapperStyle.width = $target.outerWidth(true);
                $.extend(innerStyle, $.prefix('transform', 'translateX(0)'));
                break;
            default:
                break;
        }

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);
    }

    hide() {
        if (this.status !== 'ready' || this.$target.css('display') === 'none') {
            return;
        }

        this.status = 'pending';
        const $target = this.$target;
        let originStyle = $target.attr('style') || '';

        let wrapperStyle = $.extend(
            $target.outerSize(true),
            $target.getStyle([
                'display',
                'top',
                'right',
                'bottom',
                'left'
            ])
        );

        let innerStyle = $target.outerSize(true);
        let targetPosition = $target.css('position');

        if (targetPosition !== 'static') {
            wrapperStyle.position = targetPosition;
        }

        let direction = this.direction;

        if (['absolute', 'fixed'].indexOf(targetPosition) > -1) {
            wrapperStyle[direction] = 'auto';
        }

        switch (direction) {
            case 'top':
                $.extend(
                    innerStyle,
                    {
                        bottom: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateY(0)')
                );
                break;
            case 'bottom':
                $.extend(
                    innerStyle,
                    {
                        top: 0,
                        left: 0
                    },
                    $.prefix('transform', 'translateY(0)')
                );
                break;
            case 'left':
                $.extend(
                    innerStyle,
                    {
                        top: 0,
                        right: 0
                    },
                    $.prefix('transform', 'translateX(0)')
                );
                break;
            case 'right':
                $.extend(
                    innerStyle,
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

        let $wrapper = getWrapper({
            wrapper: wrapperStyle,
            inner: innerStyle
        });

        let $inner = $('.w-drawer-inner', $wrapper);

        let targetStyle = $target.css('box-sizing') === 'border-box'
            ? $target.outerSize(true) : $target.size(true);

        if (targetPosition !== 'static') {
            targetStyle.position = 'static';
        }

        // 插入wrapper
        $wrapper.insertAfter($target.css(targetStyle));
        $inner.append($target);
        // @HACK 在完成插入操作后 需要强制触发一次repaint
        // 否则transition有可能不会触发
        $wrapper.height();

        $inner.on('webkitTransitionEnd transitionend', () => {
            this.display('hide');
            $wrapper.replaceWith($target);
            $target.attr('style', originStyle);
            $wrapper = null;
            $inner = null;
            this.status = 'ready';
            this.onChange('hide');
        });

        switch (direction) {
            case 'top':
                wrapperStyle = {height: 0};
                innerStyle = $.prefix('transform', 'translateY(100%)');
                break;

            case 'bottom':
                wrapperStyle = {height: 0};
                innerStyle = $.prefix('transform', 'translateY(-100%)');
                break;

            case 'left':
                wrapperStyle = {width: 0};
                innerStyle = $.prefix('transform', 'translateX(100%)');
                break;

            case 'right':
                wrapperStyle = {width: 0};
                innerStyle = $.prefix('transform', 'translateX(-100%)');
                break;

            default:
                break;
        }

        // 动画效果
        let transition = `${this.duration}ms ${this.timingFunction}`;

        $.extend(wrapperStyle, $.prefix('transition', transition));
        $.extend(innerStyle, $.prefix('transition', transition));

        $wrapper.css(wrapperStyle);
        $inner.css(innerStyle);
    }

    toggle() {
        if (this.$target.css('display') === 'none') {
            this.show();
        }
        else {
            this.hide();
        }
    }

    display(type = 'show') {
        let showOption = this.showOption;
        let [addOption, removeOption] = type === 'show'
            ? [showOption.add, showOption.remove]
            : [showOption.remove, showOption.add];

        if (addOption) {
            if (addOption.class) {
                let classes = addOption.class;

                if (Array.isArray(classes)) {
                    classes = classes.join(' ');
                }

                this.$target.addClass(classes);
            }

            if (addOption.style) {
                this.$target.css(addOption.style);
            }
        }

        if (removeOption) {
            if (removeOption.class) {
                let classes = removeOption.class;

                if (Array.isArray(classes)) {
                    classes = classes.join(' ');
                }

                this.$target.removeClass(classes);
            }

            if (removeOption.style) {
                this.$target.removeStyle(removeOption.style);
            }
        }
    }
}

function getWrapper(styleOpts = {wrapper: null, inner: null}) {
    // 防止外部定义样式污染
    let defaultStyle = {
        margin: 0,
        padding: 0,
        border: 'none',
        background: 'transparent'
    };

    let wrapperStyle = $.extend(
        {
            position: 'relative',
            overflow: 'hidden'
        },
        $.prefix('translateZ', 0),
        defaultStyle,
        styleOpts.wrapper
    );

    let innerStyle = $.extend(
        {position: 'absolute'},
        defaultStyle,
        styleOpts.inner
    );

    return $(`
        <div class="w-drawer-wrapper" style="${$.stringify(wrapperStyle)}">
            <div class="w-drawer-inner" style="${$.stringify(innerStyle)}">
            </div>
        </div>
    `);
}
