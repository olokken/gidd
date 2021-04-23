var stompClient = null;
var e = new SockJS("/websocket");
stompClient = Stomp.over(e);

stompClient.connect({}, function(e) {
    setConnected(!0);

    // First subscribe to the public topic.
    stompClient.subscribe("/topic/15", function(e) {
        var message = JSON.parse(e.body);
            showMessage(message);
    });

});

function showMessage(message){
    console.log(message);
}
// Send message to the connection
function sendMessage(userId, message) {
    stompClient.send("/app/chat/15", {}, JSON.stringify({
        user: userId,
        text: message,
    }));
}
