(function () {
    var $block = $('.block-1');
    var $button = $('button', $block);
    var $target = $('.target', $block);

    var drawer = new Drawer({
        $target: $target,
        duration: 200,
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
