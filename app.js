$(document).ready(function () {

    var state;
    var investigatorID;
    var suspects = [];
    var states = {
        'intro': createIntroState(),
        'scene-of-crime': createSceneOfCrimeState(),
        'three-of-crime': createThreeOfCrimeState(),
        'capture': createCaptureState()
    };

    var ids = [
        "albert_serradell",
        "alex_buchan",
        "alex_fontanellas",
        "alex_rodriguez",
        "andrea_bravo",
        "jb_tellez",
        "micaela"
    ];

    ids = _.shuffle(ids);

    hideAllStates();

    switchState('intro');

    function hideAllStates() {
        Object.keys(states).forEach(function (s) {
            $('#' + s).hide(0);
        });
    }

    function switchState(next) {

        if (state) {
            state.destroy();
        }

        state = states[next];

        state.start();
    }


    // INTRO STATE ////////////////////////////
    // modifies investigatorID shared var
    // INTRO STATE ////////////////////////////
    function createIntroState() {

        return {

            name: 'intro',

            start: function () {

                $('#intro').show(0);

                ids.forEach(function (id) {
                    $('.carousel').append('<div><img data-id="' + id + '" src="img/' + id + '.jpeg" alt=""></div>');
                });
                $('.carousel').slick({
                    centerMode: true,
                    centerPadding: '60px',
                    slidesToShow: 3,
                    responsive: [
                        {
                            breakpoint: 960,
                            settings: {
                                arrows: true,
                                centerMode: true,
                                centerPadding: '40px',
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: '40px',
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: '40px',
                                slidesToShow: 1
                            }
                        }
                    ]
                });

                $('.carousel div').on('click', function (evt) {

                    console.log('carousel click', evt.target);

                    $('.carousel div').off();

                    var investigator = $(evt.target).clone();

                    investigatorID = investigator.attr('data-id');

                    $('.content').append(investigator);

                    TweenMax.set(investigator, { scale: .2 });

                    TweenMax.to($('.carousel'), 1, { opacity: 0 });

                    TweenMax.to(investigator, 1, {
                        scale: 1.2, onComplete: function () {
                            switchState('scene-of-crime');
                        }
                    });

                    // randomly select the suspects (but strip out investigator)
                    suspects = _.shuffle(ids.filter(function (id) { return id !== investigatorID; })).slice(0, 3);

                    console.info('suspects', suspects);

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

    // SCENE OF CRIME STATE

    function createSceneOfCrimeState() {

        return {

            name: 'scene-of-crime',

            start: function () {

                $('#scene-of-crime').show();

                var investigator = { name: investigatorID, img: investigatorID + ".jpeg" };

                var discussionLines = getDiscussionLines();

                var tl = new TimelineMax({ delay: 1, onComplete: onComplete });

                discussionLines.forEach(addLine);

                $('#js-btn-restart').on('click', restart);

                $('#js-btn-back').on('click', gotoPreviousLabel);

                $('#js-btn-skip').on('click', skip);

                function onComplete() {
                    switchState('three-of-crime');
                }

                function restart() {
                    tl.restart();
                }

                function skip() {
                    tl.progress(1, false);
                }

                function gotoPreviousLabel() {

                    var labelNames = tl.getLabelsArray().map(function (label) { return label.name });

                    console.log('labels', labelNames);

                    var currentLabel = tl.currentLabel();

                    console.log('current label', currentLabel);

                    var currentLabelIndex = labelNames.indexOf(currentLabel);

                    console.log('current label index', currentLabelIndex);

                    if (currentLabelIndex > 0) {

                        var previousLabel = labelNames[currentLabelIndex - 1];

                        console.log('previou label', previousLabel);

                        tl.seek(previousLabel);
                    }

                }



                function addLine(line, index) {

                    var classToAdd = line.isInvestigator ? 'investigator' : 'client';

                    var node = line.isInvestigator ?
                        $('<div class="row discussion investigator"><div class="col-sm-3"><div class="card"><img src="' + line.img + '" alt=""></div></div><div class="col-sm-9"><p>' + line.text + '</p></div></div>')
                        :
                        $('<div class="row discussion client"><div class="col-sm-9"><p>' + line.text + '</p></div><div class="col-sm-3"><div class="card"><img src="' + line.img + '" alt=""></div></div></div>')

                    node.css('top', index * 100 + 'px');


                    if (!line.isInvestigator) {
                        node.css('left', '100px');
                    }

                    $('.discussion-container').append(node);

                    TweenMax.set(node, { opacity: 0 });

                    var offset = line.offset || 2;

                    tl.to(node, 1, { opacity: 1 }).addLabel('label-' + index).to(node, .25, { opacity: .2 }, "+=" + (offset));
                }

                function getDiscussionLines() {
                    return [
                        {
                            text: "What is the nature of the crime?",
                            isInvestigator: true,
                            img: "img/" + investigator.img,
                        },
                        {
                            text: "Somebody used door to programmer pen and didn't close it completely!",
                            isInvestigator: false,
                            img: "img/matias_lorenzo.jpeg",
                        },
                        {
                            text: "Is that serious?",
                            isInvestigator: true,
                            img: "img/" + investigator.img,
                        },
                        {
                            text: "Extremely! We have a sign on the door. What part of \"entirely\" don't they understand???",
                            isInvestigator: false,
                            img: "img/hector_leon.jpeg",
                        },
                        {
                            text: "Do you have any suspects?",
                            isInvestigator: true,
                            img: "img/" + investigator.img,
                        },
                        {
                            text: "There are 3 students we have our eye on but...",
                            isInvestigator: false,
                            img: "img/matias_lorenzo.jpeg",
                        },
                        {
                            text: "... we are prohibited by E.U. law from telling you who they are :(",
                            isInvestigator: false,
                            img: "img/marc_llopis.jpeg",
                        },
                    ];
                }
            },

            destroy: function () {
                $('#' + this.name).hide();
            }
        }
    }

    // 3 of a crime state
    function createThreeOfCrimeState() {

        return {

            name: 'three-of-crime',

            start: function () {

                $('#three-of-crime').show();

                var characters = ids.filter(function (id) {
                    return id !== investigatorID;
                });

                console.log('characters', characters);

                var cards = [];
                // need to generate cards with every 3 character combo
                for (var i = 0; i < characters.length; i++) {
                    for (j = i + 1; j < characters.length; j++) {
                        for (var k = j + 1; k < characters.length; k++) {
                            

                            if (suspects.indexOf(characters[i]) > -1 &&
                                suspects.indexOf(characters[j]) > -1 &&
                                suspects.indexOf(characters[k]) > -1) {

                                    // don't create card with all 3 suspects

                            } else {
                                
                                cards.push(_.shuffle([characters[i], characters[j], characters[k]]));
                            }
                        }
                    }
                }

                cards = _.shuffle(cards);

                $('#js-flip-card-btn').on('click', function (evt) {

                    if (cards.length > 0) {

                        var card = cards.pop();

                        var $row = $('<div class="row"></div>');
                        $('#js-card-stack').prepend($row);

                        $row.append('<div class="col-md-3 card"><img src="./img/' + card[0] + '.jpeg"></div>');
                        $row.append('<div class="col-md-3 card"><img src="./img/' + card[1] + '.jpeg"></div>');
                        $row.append('<div class="col-md-3 card"><img src="./img/' + card[2] + '.jpeg"></div>');
                        $row.append('<div class="col-md-3 suspect-count"><p>There are <strong>' + getMatchingSuspectCount(card) + '</strong> suspects here</p></div>');

                        TweenMax.to('img', 1, { scale: 1.1 });

                    } else {

                        alert('out of chances!!!')
                    }

                });



                $('#js-capture-btn').on('click', function (evt) {
                    switchState('capture');
                });

                function getMatchingSuspectCount(card) {

                    var matchCount = 0;

                    card.forEach(function (suspect) {
                        if (suspects.indexOf(suspect) > -1) {
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


    // CAPTURE STATE
    function createCaptureState() {

        return {

            name: 'capture',


            start: function () {

                console.log('start', this.name);

                $('#capture').show();

                var masterIDs = [
                    "albert_serradell",
                    "alex_buchan",
                    "alex_fontanellas",
                    "alex_rodriguez",
                    "andrea_bravo",
                    "jb_tellez",
                    "micaela"
                ];


                var workingIDs = [];

                var captured = [];

                initWorkingIDs();

                $('.rooms').on('click', function (evt) {

                    var target = $(evt.target);

                    var targetID = target.attr('id');

                    if (target.is('img')) {

                        var suspectIndex = suspects.indexOf(targetID);

                        if (suspectIndex > -1) {

                            console.log('got one suspect!!!');

                            captured.push(targetID);

                            if (captured.length === 3) {

                                clearInterval(gameLoop);
                            } else {

                                initWorkingIDs();
                            }

                            TweenMax.killTweensOf(target);

                            TweenMax.to(target, .25, { repeat: 100, yoyo: true, scale: 1.2 });

                        } else {

                            console.log("WRONG!!! Start over");

                            captured.forEach(function (suspect) {
                                TweenMax.killTweensOf($('#' + suspect));
                                $('#' + suspect).remove();
                            });

                            captured = [];

                            initWorkingIDs();
                        }
                    }
                });

                function initWorkingIDs() {

                    workingIDs = masterIDs.slice().reduce(function (acc, id) {
                        if (captured.indexOf(id) === -1) {
                            acc.push(id);
                        }

                        return acc;

                    }, []);

                    workingIDs = _.shuffle(workingIDs);
                }

                var gameLoop = setInterval(function () {

                    var randRow = Math.floor(Math.random() * 2);

                    var randCol = Math.floor(Math.random() * 6);

                    var cell = $('[data-row="' + randRow + '"][data-col="' + randCol + '"]');

                    if (!cell.children().length) {

                        var id = workingIDs.pop();

                        if (workingIDs.length === 0) {
                            initWorkingIDs();
                        }

                        var img = $('<img id="' + id + '" src="img/' + id + '.jpeg">');

                        cell.append(img);

                        TweenMax.from(img, .5, {
                            opacity: 0, onComplete: function () {
                                TweenMax.to(img, .5, {
                                    opacity: 0, delay: 1, onComplete: function () {
                                        img.remove();
                                    }
                                });
                            }
                        });

                    }
                }, 1000);
            },

            destroy: function () { }
        }
    }
});
