package IDATT2106.team6.Gidd.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import IDATT2106.team6.Gidd.util.Logger;
@Component
public class WebSocketEventListener {
    private Logger logger = new Logger(WebSocketEventListener.class.getName());
    @Autowired
    private SimpMessagingTemplate template;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("recieved a new websocket connection");
    }
}
