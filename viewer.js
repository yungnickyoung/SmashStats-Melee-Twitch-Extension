var token = "";
var client_id = "";
var sliderIsCollapsed = true;

const twitch = window.Twitch.ext;

function updateStats(data) {
    data = JSON.parse(data);
    validateData(data);
    for (var key in data) {
        $('#' + key).text(data[key]);
    }
}

function validateData(data) {
    // Sanitize player names
    p1Name = sanitizeString(data.textPlayer1Name);
    p2Name = sanitizeString(data.textPlayer2Name);
    data.textPlayer1Name = p1Name;
    data.textPlayer2Name = p2Name;
    $('#textPlayer1Name').attr('title', p1Name);
    $('#textPlayer2Name').attr('title', p2Name);

    // console.log("players: " + data.textPlayer1Name + "|||" + data.textPlayer2Name);

    // Ensure all statistics received from EBS are integers; otherwise makes them blank
    for (var key in data) {
        val = data.key;
        if (!(typeof val === 'number' && (val % 1) === 0)) {
            val = 'N/A';
        }
    }
}

function updateStatsFromConfig() {
    if (typeof twitch.configuration.broadcaster === 'undefined') {
        return;
    }
    // console.log(twitch.configuration.broadcaster);
    content = twitch.configuration.broadcaster.content;
    updateStats(content);
}

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

twitch.onAuthorized(function (auth) {
    // console.log('authorized');
    // save our credentials
    token = auth.token;
    client_id = auth.clientId;
    // console.log(token);
    // console.log(client_id);
    updateStatsFromConfig();
});

twitch.listen('broadcast', function (topic, contentType, message) {
    // console.log('Recv ' + topic + ' ' + contentType + ' ' + message);
    if (topic === "broadcast") {
        // console.log('Broadcast received');
        updateStats(message);
    }
});

$('div.root').mouseenter(function () {
    if (sliderIsCollapsed) {
        $('div.smash-stats-extension').addClass('show');
        $('div.smash-stats-extension').removeClass('hide');
    }
});

$('div.root').mouseleave(function () {
    if (sliderIsCollapsed) {
        $('div.smash-stats-extension').addClass('hide');
        $('div.smash-stats-extension').removeClass('show');
    }
});

$('div.dismiss-button-toggler').mouseenter(function () {
    $('div.dismiss-button-wrapper').addClass('show');
    $('div.dismiss-button-wrapper').removeClass('hide');
});

$('div.dismiss-button-toggler').mouseleave(function () {
    $('div.dismiss-button-wrapper').addClass('hide');
    $('div.dismiss-button-wrapper').removeClass('show');
});

$('div.toggle-button').click(function () {
    $('div.slider').toggle('size', { origin: ["top", "right"] }, 200);
    sliderIsCollapsed = !sliderIsCollapsed;
});

$('div.players-header').click(function () {
    $('div.slider').toggle('size', { origin: ["top", "right"] }, 200);
    sliderIsCollapsed = !sliderIsCollapsed;
});

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}