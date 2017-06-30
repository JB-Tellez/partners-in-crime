function IntroState(model) {

    return {

        name: 'intro',

        start: function () {

            $('#' + this.name).show(0);

            // add images to carousel
            model.ids.forEach(function (id) {
                $('.carousel').append('<div><img data-id="' + id + '" src="img/hackers/' + id + '.jpeg" alt=""></div>');
            });

            // configure carousel
            $('.carousel').slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3
            });


            $('.carousel div').on('click', function (evt) {

                $('.carousel div').off();

                var investigator = $(evt.target).clone();

                investigator.css('height','300px');

                $('.content').append(investigator);

                model.investigatorID = investigator.attr('data-id');

                // now limit the ids to 7 else game takes too long
                model.ids.splice(model.ids.indexOf(model.investigatorID), 1);

                model.ids = model.ids.slice(0,7);

                console.log(model.ids);

                var tl = new TimelineMax();
               
                tl.to($('.carousel'), 1, { opacity: 0, marginTop: "-300px"});

                tl.call(model.complete, null, "+1");
            
                // randomly select the suspects (but strip out investigator)
                model.suspects = _.shuffle(model.ids.filter(function (id) { return id !== model.investigatorID; })).slice(0, 3);

            });

            TweenMax.from($('.jumbotron'), 1, { opacity: 0, rotation: -720, scale: .2, force3D: true, delay: 1 });
            TweenMax.from($('.carousel'), 1, { opacity: 0, delay: 2 });

        },

        destroy: function () {
            $('#intro').hide();
            $('.carousel div').off();
            TweenMax.killAll();
        },


    }
}