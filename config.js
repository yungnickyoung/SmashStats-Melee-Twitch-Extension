var token = "";
var client_id = "";

const twitch = window.Twitch.ext;
const targetURL = 'https://www.getsmashstats.com/'
// const targetURL = 'http://localhost:5001/'

function createRequest(type, method, params) {
    return {
        type: type,
        url: targetURL + method + '?' + params,
        contentType: "application/json",
        success: function() {
            $('#configResponse').text("Successfully updated stats view.");
        },
        error: function(xhr) {
            if (xhr.responseText == "") {
                $('#configResponse').text("Error updating stats view. \nUnable to receive proper response from server. Might be down?");
            } else {
                $('#configResponse').text("Error updating stats view: " + xhr.responseText);
            }
        }
    };
}

twitch.onAuthorized(function (auth) {
    token = auth.token;
    client_id = auth.clientId;
    $('#update-submit').removeAttr('disabled');
    updateConfigTextFields();
});

// Update the input text boxes to match the latest matchup entered on this channel
function updateConfigTextFields() {
    if (typeof twitch.configuration.broadcaster === 'undefined') {
        return; // No previous config service entry exists
    }
    data = JSON.parse(twitch.configuration.broadcaster.content);
    $('#inputPlayer1Name').val(sanitizeString(data.textPlayer1Name));
    $('#inputPlayer2Name').val(sanitizeString(data.textPlayer2Name));
}

$('#config-form').submit(function(e) {
    e.preventDefault();
    var params = $(this).serialize();
    var getRequest = createRequest('GET', 'matchup/melee', params);

    getRequest.headers = { 
        'Authorization': 'Bearer ' + token,
        'Client-Id': client_id
    }

    $.ajax(getRequest);
    $('#configResponse').text("Updating...");
});

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}