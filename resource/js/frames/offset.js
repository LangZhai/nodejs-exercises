$(function () {
    var template_figure = ZLTemplate('#template_figure'),
        template_li = ZLTemplate('#template_li'),
        $article = $('body>article'),
        $section = $('>section', $article),
        $ul = $('>aside>section>ul', $article),
        $footer = $('body>footer'),
        $result = $('>p>output', $footer),
        $target = $(),
        list = [],
        curr = 0,
        deal = function (offset, move) {
            var position = $target.position(),
                txt;
            $target.css({left: position.left + move.offsetX - offset.offsetX, top: position.top + move.offsetY - offset.offsetY});
            txt = $.map($target.parent().children(), function (item) {
                return $(item).position();
            });
            if (txt.length) {
                $result.text([txt[1].left - txt[0].left, txt[1].top - txt[0].top]);
            }
        };

    $section.on({
        dragstart: function (e) {
            $target.data('offset', {offsetX: e.offsetX, offsetY: e.offsetY});
        },
        dragend: function (e) {
            deal($target.data('offset'), {offsetX: e.offsetX, offsetY: e.offsetY});
        }
    }, '>figure.curr');
    $ul.on('click', '>li', function () {
        var $this = $(this);
        $target = $section.children(':eq(' + $this.index() + ')');
        $this.add($target).addClass('curr').siblings().removeClass('curr');
    });
    $footer.on('change', 'input[type=file]', function (event) {
        var index = $(this).parent().index(),
            $children = $section.children(':eq(' + index + ')');
        curr = 0;
        list[index] = Array.prototype.map.call(event.target.files, function (item) {
            return {
                src: window.URL.createObjectURL(item),
                name: item.name
            };
        });
        if (list[index].length) {
            if ($children.length) {
                $ul.children(':eq(' + index + ')').replaceWith(template_li.template(list[index][curr]));
            } else {
                $section.append(template_figure.template(list[index][curr]));
                $ul.append(template_li.template(list[index][curr]));
            }
        }
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

    setInterval(function () {
        list.forEach(function (item, index) {
            var $children = $section.children(':eq(' + index + ')');
            if (item[curr]) {
                $children.children('img').prop('src', item[curr].src);
                $children.children('figcaption').text(item[curr].name);
            }
        });
        curr++;
        if (curr === Math.max.apply(null, list.map(function (item) {
            return item.length;
        }))) {
            curr = 0;
        }
    }, 85);
});