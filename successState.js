 function SuccessState(model) {

        return {

            name: 'success',

            start: function () {

                $('#' + this.name).show();

                $('#suspect-1 img').attr('src', 'img/hackers/' + model.suspects[0] + '.jpeg');
                $('#suspect-2 img').attr('src', 'img/hackers/' + model.suspects[1] + '.jpeg');
                $('#suspect-3 img').attr('src', 'img/hackers/' + model.suspects[2] + '.jpeg');

                var tl = new TimelineMax({ delay: 0 });

                tl.from($('.bars'), 1.5, { opacity: 0 });
                tl.from($('#suspect-1'), .5, { scale: 0, rotation: -720 }, "-=1.5");
                tl.from($('#suspect-2'), .5, { scale: 0, rotation: -720 }, "-=1.25");
                tl.from($('#suspect-3'), .5, { scale: 0, rotation: -720 }, "-=1.00");


            },
            destroy: function () {
                $('#' + this.name).hide();
            }
        }
    }