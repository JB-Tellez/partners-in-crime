function ThreeOfCrimeState(model) {

    return {

        name: 'three-of-crime',

        start: function () {

            $('#three-of-crime').show();

            var cards = [];

            initCards();

            function initCards() {


                var characters = model.ids.filter(function (id) {
                    return id !== model.investigatorID;
                });

                // need to generate cards with every 3 character combo
                for (var i = 0; i < characters.length; i++) {
                    for (j = i + 1; j < characters.length; j++) {
                        for (var k = j + 1; k < characters.length; k++) {


                            if (model.suspects.indexOf(characters[i]) > -1 &&
                                model.suspects.indexOf(characters[j]) > -1 &&
                                model.suspects.indexOf(characters[k]) > -1) {

                                // don't create card with all 3 suspects

                            } else {

                                cards.push(_.shuffle([characters[i], characters[j], characters[k]]));
                            }
                        }
                    }
                }

                cards = _.shuffle(cards);

            }

            $('#js-flip-card-btn').on('click', function() {
                $('.marquee').slideUp(1000);
                showLineUp();
            });

            $('#js-capture-btn').on('click', function (evt) {
                model.complete();
            });

            $('#js-card-stack').on('click', function (evt) {
                $(evt.target).toggleClass('suspect');
            });

            showLineUp();

            function showLineUp() {

                if (cards.length > 0) {

                    var card = cards.pop();

                    var $row = $('<div class="row"></div>');
                    $('#js-card-stack').prepend($row);

                    $row.append('<div class="col-md-3 card"><img src="./img/hackers/' + card[0] + '.jpeg"></div>');
                    $row.append('<div class="col-md-3 card"><img src="./img/hackers/' + card[1] + '.jpeg"></div>');
                    $row.append('<div class="col-md-3 card"><img src="./img/hackers/' + card[2] + '.jpeg"></div>');
                    $row.append('<div class="col-md-3 suspect-count"><p>There are <strong>' + getMatchingSuspectCount(card) + '</strong> suspects in the lineup</p></div>');

                    TweenMax.to('img', 1, { scale: 1.1 });

                    $('#js-card-stack').css({ scrollTop: 0 });

                } else {

                    console.log('keep going');

                    initCards();
                }
            }

            function getMatchingSuspectCount(card) {

                var matchCount = 0;

                card.forEach(function (suspect) {
                    if (model.suspects.indexOf(suspect) > -1) {
                        matchCount++;
                    }
                });

                return matchCount;
            }
        },

        destroy: function () {

            // remove event listners, hide self, etc.

            $('#three-of-crime').hide();
            $('#js-capture-btn').off();

        }
    }
}