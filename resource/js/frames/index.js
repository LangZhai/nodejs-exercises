$(function () {
    var template_figure = ZLTemplate('#template_figure'),
        template_li = ZLTemplate('#template_li'),
        $article = $('body>article'),
        $section = $('>section', $article),
        $nav = $('>aside>section', $article),
        $ul = $('>ul', $nav),
        $footer = $('body>footer'),
        $result = $('>p>output', $footer),
        $target = $(),
        w = $article.width() * .5,
        h = $article.height() * .5,
        deal = function (offset, move) {
            var $parent = $target.parent(),
                $children = $parent.children(),
                position = $target.position(),
                txt;
            $target.css({left: position.left + move.offsetX - offset.offsetX, top: position.top + move.offsetY - offset.offsetY});
            txt = [8, $children.length * .2].concat($.map($children, function (item) {
                var $this = $(item),
                    position = $this.position();
                return [w - position.left, h - position.top, $this.width(), $this.height()];
            })).join(',');
            $result.eq($parent.index()).text(txt).end().next().attr('href', '/frames/save/?txt=' + txt);
        };

    $section.on({
        dragstart: function (e) {
            $target.data('offset', {offsetX: e.offsetX, offsetY: e.offsetY});
        },
        dragend: function (e) {
            deal($target.data('offset'), {offsetX: e.offsetX, offsetY: e.offsetY});
        }
    }, '>figure.curr');
    $nav.on('click', function () {
        var $this = $(this);
        $this.add($section.eq($this.index())).addClass('curr').siblings().removeClass('curr');
    });
    $ul.on('click', '>li', function () {
        var $this = $(this),
            $parent = $section.eq($this.parent().parent().index());
        $target = $parent.children(':eq(' + $this.index() + ')');
        $this.add($target).add($parent).addClass('curr').siblings().removeClass('curr');
    });
    $footer.on('change', 'input[type=file]', function (event) {
        var index = $(this).parent().index(),
            data = Array.from(event.target.files).map(function (item) {
                return {src: window.URL.createObjectURL(item), name: item.name};
            });
        if (data.length % 5 !== 0) {
            alert('请完整选择5个方向的图片！');
            $(this).val('');
            return;
        }
        $section.eq(index).html(template_figure.template(data));
        $ul.eq(index).html(template_li.template(data));
    });

    $(document).on('keydown', function (e) {
        if ($target.length) {
            switch (e.keyCode) {
                case 37:
                    e.preventDefault();
                    deal({offsetX: 0, offsetY: 0}, {offsetX: -1, offsetY: 0});
                    break;
                case 38:
                    e.preventDefault();
                    deal({offsetX: 0, offsetY: 0}, {offsetX: 0, offsetY: -1});
                    break;
                case 39:
                    e.preventDefault();
                    deal({offsetX: 0, offsetY: 0}, {offsetX: 1, offsetY: 0});
                    break;
                case 40:
                    e.preventDefault();
                    deal({offsetX: 0, offsetY: 0}, {offsetX: 0, offsetY: 1});
                    break;
            }
        }
    });
});