$(document).ready(function () {

    var DEBUG = true;

    var model = {
        investigatorID: '',
        ids: [],
        suspects: [],
        state: undefined,
        complete: function() {
            switchState(getNextState());
        }
    };

    model.ids = [
        "albert",
        "alex_b",
        "alex_f",
        "alex_r",
        "andrea",
        "ark",
        "arnau",
        "brad",
        "camille",
        "carmen",
        "christiana",
        "cillian",
        "denis",
        "djaf",
        "jorge",
        "jb",
        "julius",
        "laura",
        "luis",
        "micaela",
        "miguel",
        "petra",
        "rachel",
        "sara",
        "stephanos"
    ];

    model.ids = _.shuffle(model.ids);

    // DANGER: store functions versus instantiating now???
    var states = {
        'intro': new IntroState(model),
        'scene-of-crime': new SceneOfCrimeState(model),
        'three-of-crime': new ThreeOfCrimeState(model),
        'capture': new CaptureState(model),
        'success': new SuccessState(model),
    };

   getNextState = function () {

        var nextState;

        switch (model.state.name) {

            case 'intro':

                nextState = 'scene-of-crime';

                break;

            case 'scene-of-crime':

                nextState = 'three-of-crime';

                break;

            case 'three-of-crime':

                nextState = 'capture';

                break;

            case 'capture':

                nextState = 'success';

                break;

        }

        return nextState;
    }


    hideAllStates();

    document.getElementById('background-audio').play();
    document.getElementById('background-audio').currentTime = 15;

    if (DEBUG) {

        model.investigatorID = model.ids.slice().pop();

        model.suspects = model.ids.slice(1, 4);

        console.log(model.investigatorID, model.suspects);

        switchState('capture');

    } else {

        switchState('intro');
    }

    // FUNCTIONS ///////////////
    function hideAllStates() {
        Object.keys(states).forEach(function (s) {
            $('#' + s).hide(0);
        });
    }

    function switchState(next) {

        if (model.state) {
            model.state.destroy();
        }

        model.state = states[next];

        model.state.start();
    }
});
