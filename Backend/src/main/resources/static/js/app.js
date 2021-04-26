var stompClient = null;
let groupId;

function openConnection(group){
    groupId = group;
    var e = new SockJS("/websocket");
    stompClient = Stomp.over(e);

    stompClient.connect({}, function(e) {
        stompClient.subscribe("/client/chat/" + groupId , function(e) {
            var message = JSON.parse(e.body);
            console.log(message);
        });
    })

}

// Send message to the connection
function sendMessage(activityId, message, userId) {
    stompClient.send("/server/chat/" + groupId, {}, JSON.stringify({
        user: userId,
        message: message
    }));
}
