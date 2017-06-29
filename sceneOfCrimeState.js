// SCENE OF CRIME STATE

    function SceneOfCrimeState(model) {

        return {

            name: 'scene-of-crime',

            start: function () {

                $('#scene-of-crime').show();

                var investigator = { name: model.investigatorID, img: model.investigatorID + ".jpeg" };

                var discussionLines = getDiscussionLines();

                var tl = new TimelineMax({ delay: .5 });

                discussionLines.forEach(addLine);

                $('#js-btn-done').on('click', done);

                $('#js-btn-back').on('click', gotoPreviousLabel);

                $('#js-btn-next').on('click', gotoNextLabel);

                function done() {
                    tl.progress(1, false);
                    model.complete();
                }

                function restart() {
                    tl.restart();
                }

                function gotoPreviousLabel() {

                    var labelNames = tl.getLabelsArray().map(function (label) { return label.name });

                    var currentLabel = tl.currentLabel();

                    var currentLabelIndex = labelNames.indexOf(currentLabel);

                    if (currentLabelIndex > 0) {

                        var previousLabel = labelNames[currentLabelIndex - 1];

                        tl.seek(previousLabel);
                    }

                }

                function gotoNextLabel() {

                    var labelNames = tl.getLabelsArray().map(function (label) { return label.name });

                    var currentLabel = tl.currentLabel();

                    var currentLabelIndex = labelNames.indexOf(currentLabel);

                    if (currentLabelIndex < labelNames.length - 1) {

                        var nextLabel = labelNames[currentLabelIndex + 1];

                        tl.seek(nextLabel);

                    } else {

                        done();
                    }

                }



                function addLine(line, index) {

                    var classToAdd = line.isInvestigator ? 'investigator' : 'client';

                    var node = line.isInvestigator ?
                        $('<div class="row discussion investigator"><div class="col-sm-3"><div class="card"><img src="' + line.img + '" alt=""></div></div><div class="col-sm-9"><p>' + line.text + '</p></div></div>')
                        :
                        $('<div class="row discussion client"><div class="col-sm-9"><p>' + line.text + '</p></div><div class="col-sm-3"><div class="card"><img src="' + line.img + '" alt=""></div></div></div>')

                    node.css('top', index * 80 + 'px');

                    $('.discussion-container').append(node);

                    TweenMax.set(node, { opacity: 0 });

                    var offset = line.offset || 4;

                    tl.to(node, 1, { opacity: 1 }).addLabel('label-' + index).to(node, .25, { opacity: .2 }, "+=" + (offset));
                }

                function getDiscussionLines() {
                    return [
                        {
                            text: "What is the nature of the crime?",
                            isInvestigator: true,
                            img: "img/hackers/" + investigator.img,
                        },
                        {
                            text: "3 naughty students used door to programmer room and didn't close it completely!",
                            isInvestigator: false,
                            img: "img/hackers/matias.jpeg",
                        },
                        {
                            text: "Is that serious?",
                            isInvestigator: true,
                            img: "img/hackers/" + investigator.img,
                        },
                        {
                            text: "Extremely! We have a sign on the door. What part of \"completely\" don't they understand???",
                            isInvestigator: false,
                            img: "img/hackers/hector.jpeg",
                        },
                        {
                            text: "Do you have any suspects?",
                            isInvestigator: true,
                            img: "img/hackers/" + investigator.img,
                        },
                        {
                            text: "There are 3 students we have our eye on but...",
                            isInvestigator: false,
                            img: "img/hackers/tair.jpeg",
                        },
                        {
                            text: "... we are prohibited by E.U. law from telling you who they are :(",
                            isInvestigator: false,
                            img: "img/hackers/marc.jpeg",
                        },
                    ];
                }
            },

            destroy: function () {
                $('#' + this.name).hide();
            }
        }
    }