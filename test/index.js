(function () {
    var $block = $('.block-1');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target,
        duration: 2000,
        showOption: {
            remove: {
                class: 'hide'
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
        $target: $target,
        duration: 2000,
        direction: 'bottom',
        showOption: {
            remove: {
                class: 'hide'
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
        $target: $target,
        duration: 2000,
        direction: 'top',
        showOption: {
            remove: {
                class: 'hide'
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
        $target: $target,
        duration: 2000,
        direction: 'top',
        showOption: {
            remove: {
                class: 'hide'
            }
        }
    });

    $button.on('click', function () {
        drawer.toggle();
    });
})();
