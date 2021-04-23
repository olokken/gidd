var stompClient = null;
let groupId = 15;
var e = new SockJS("/websocket");
stompClient = Stomp.over(e);

stompClient.connect({}, function(e) {

// First subscribe to the public topic.
    stompClient.subscribe("/topic/public", function(e) {
        var message = JSON.parse(e.body);
        console.log(message);
    });

    // Then notify everyone (including yourself) that you joined the public topic.
})



// Send message to the connection
function sendMessage(userId, message) {

    stompClient.send("/app/chat/15", {}, JSON.stringify({
        user: userId,
        text: message,
    }));
}
