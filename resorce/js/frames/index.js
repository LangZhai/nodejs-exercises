$(function () {
    var $template_figure = $('#template_figure'),
        $template_li = $('#template_li'),
        $article = $('body>article'),
        $section = $('>section', $article),
        $nav = $('>aside>section', $article),
        $ul = $('>ul', $nav),
        $footer = $('body>footer'),
        $result = $('>p>output', $footer),
        w = $article.width() * .5,
        h = $article.height() * .5;
    $section.on({
        dragstart: function (e) {
            $(this).data('offset', {offsetX: e.offsetX, offsetY: e.offsetY});
        },
        dragend: function (e) {
            var $this = $(this),
                $parent = $this.parent(),
                $children = $parent.children(),
                position = $this.position(),
                offset = $this.data('offset'),
                txt = [8, $children.length * .2].concat($.map($children, function (item) {
                    var $this = $(item),
                        position = $this.position();
                    return [w - position.left, h - position.top, $this.width(), $this.height()];
                })).join(',');
            $this.css({left: position.left + e.offsetX - offset.offsetX, top: position.top + e.offsetY - offset.offsetY});
            $result.eq($parent.index()).text(txt).end().next().attr('href', '/frames/save/?txt=' + txt);
        }
    }, '>figure.curr');
    $nav.on('click', function () {
        var $this = $(this);
        $this.add($section.eq($this.index())).addClass('curr').siblings().removeClass('curr');
    });
    $ul.on('click', '>li', function () {
        var $this = $(this),
            $parent = $this.parent().parent(),
            $target = $section.eq($parent.index());
        $this.add($target.children(':eq(' + $this.index() + ')')).add($target).addClass('curr').siblings().removeClass('curr');
    });
    $footer.on('change', 'input[type=file]', function (event) {
        var index = $(this).parent().index(),
            data = Array.from(event.target.files).map(function (item) {
                return {src: window.URL.createObjectURL(item), name: item.name};
            });
        if (data.length % 5 !== 0) {
            alert('请完整添加5个方向的图片！');
            $(this).val('');
            return;
        }
        $section.eq(index).html($template_figure.template(data));
        $ul.eq(index).html($template_li.template(data));
    });
});