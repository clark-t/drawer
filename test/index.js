/**
 * @file index.js
 * @author clarkt(clarktanglei@163.com)
 */

/* globals Drawer */
(function () {
    var $block = $('.block-1');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 200,
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-2');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 500,
        direction: 'bottom',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-3');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 500,
        direction: 'top',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-4');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 500,
        direction: 'top',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-5');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 500,
        direction: 'right',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-6');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 500,
        direction: 'right',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-7');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 200,
        direction: 'left',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();

(function () {
    var $block = $('.block-8');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target[0],
        duration: 500,
        direction: 'left',
        showOption: {
            remove: {
                'class': 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();
