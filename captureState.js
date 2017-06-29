
    function CaptureState(model) {

        return {

            name: 'capture',


            start: function () {

                console.log('start', this.name);

                $('#capture').show();

                var masterIDs = model.ids.slice();

                var workingIDs = [];

                var captured = [];

                initWorkingIDs();

                $('.rooms').on('click', function (evt) {

                    var target = $(evt.target);

                    target.css('opacity', 1);

                    var targetID = target.attr('id');

                    if (target.is('img')) {

                        var suspectIndex = model.suspects.indexOf(targetID);

                        if (suspectIndex > -1) {

                            captured.push(targetID);

                            if (captured.length === 3) {

                                clearInterval(gameLoop);

                                model.complete();

                            } else {

                                initWorkingIDs();
                            }

                            TweenMax.killTweensOf(target);

                            TweenMax.to(target, .25, { repeat: -1, yoyo: true, scale: 1.2 });

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

                        var img = $('<img id="' + id + '" src="img/window-shots/' + id + '.jpeg">');

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

            destroy: function () {
                $('#' + this.name).hide();
                TweenMax.killAll();
            }
        }

    }