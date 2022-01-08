var token = "";
var tuid = "";
var ebs = "";

// because who wants to type this every time?
var twitch = window.Twitch.ext;
var scene = 'base';
var tag = '';
var email = '';
var twitchname = '';
// create the request options for our Twitch API calls
var requests = {
    set: createRequest('POST', 'cycle'),
    get: createRequest('GET', 'query')
};

function renderScene(){
    $('#baseScene').hide()
    $('#tagScene').hide()
    $('#twitchScene').hide()
    $('#emailScene').hide()
    $('#finalScene').hide()
    if(scene == 'base'){
        $('#baseScene').fadeIn('slow')
    }else if(scene == 'tag'){
        $('#tagScene').fadeIn('slow')
    }else if(scene == 'twitch'){
        $('#twitchScene').fadeIn('slow')
    }else if(scene == 'email'){
        $('#emailScene').fadeIn('slow')
    }else if(scene == 'final'){
        $('#finalScene').fadeIn('slow')
    }
}
function createRequest(type, method) {

    return {
        type: type,
        url: location.protocol + '//localhost:8081/color/' + method,
        success: updateBlock,
        error: logError
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        twitch.rig.log('Setting auth headers');
        requests[req].headers = { 'Authorization': 'Bearer ' + token }
    });
}

twitch.onContext(function(context) {
    twitch.rig.log(context);
});

twitch.onAuthorized(function(auth) {
    // save our credentials
    token = auth.token;
    tuid = auth.userId;

    // enable the button
    $('#cycle').removeAttr('disabled');

    setAuth(token);
    $.ajax(requests.get);
    renderScene()
});

function updateBlock(hex) {
    twitch.rig.log('Updating block color');
    $('#color').css('background-color', hex);
}

function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  // we could also use the output to update the block synchronously here,
  // but we want all views to get the same broadcast response at the same time.
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

$(function() {
    $('#enterButton').click(function() {
        scene = 'tag'
        renderScene()
    })
    $('.homeButton').click(function() {
        scene = 'base'
        $('#cashtag').text('')
        $('#twitchname').text('')
        $('#email').text('')
        tag = ''
        twitchname = ''
        email = ''
        renderScene()
    })
    $('.submitButton').click(function() {
        if(scene == 'tag'){
            tag = $('#inputTag').val()
            scene = 'twitch'
            renderScene()
        }else if(scene == 'twitch'){
            twitchname = $('#inputTwitch').val()
            scene = 'email'
            renderScene()
        }else if(scene == 'email'){
            email = $('#inputEmail').val()
            $('#cashtag').text(tag)
            $('#twitchname').text(twitchname)
            $('#email').text(email)
            scene = 'final'
            renderScene()
        }
    })
    $('#submit').click(function() {
        $('#check').text("Entered!")
        $('#submitText').text("Update")
    })
    // when we click the cycle button
    $('#cycle').click(function() {
        if(!token) { return twitch.rig.log('Not authorized'); }
        twitch.rig.log('Requesting a color cycle');
        $.ajax(requests.set);
    });

    // listen for incoming broadcast message from our EBS
    twitch.listen('broadcast', function (target, contentType, color) {
        twitch.rig.log('Received broadcast color');
        updateBlock(color);
    });
});
