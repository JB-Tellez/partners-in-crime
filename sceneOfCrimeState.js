// SCENE OF CRIME STATE

    function SceneOfCrimeState(model) {

        return {

            name: 'scene-of-crime',

            start: function () {

                $('#scene-of-crime').show();

                var investigator = { name: model.investigatorID, img: model.investigatorID + ".jpeg" };

                var discussionLines = getDiscussionLines();

                var tl = new TimelineMax({ delay: .5, onComplete: onComplete });

                discussionLines.forEach(addLine);

                $('#js-btn-restart').on('click', restart);

                $('#js-btn-back').on('click', gotoPreviousLabel);

                $('#js-btn-skip').on('click', skip);

                function onComplete() {
                    model.complete();
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

                    var offset = line.offset || 4;

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