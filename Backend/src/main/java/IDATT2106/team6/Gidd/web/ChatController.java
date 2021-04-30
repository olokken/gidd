package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.Chat;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.*;
import IDATT2106.team6.Gidd.util.Logger;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.HashMap;
import java.util.List;

import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;
import static IDATT2106.team6.Gidd.web.ControllerUtil.getRandomID;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("")
public class ChatController {
    private static Logger log = new Logger(ChatController.class.toString());
    @Autowired
    private ChatService chatService;
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private UserService userService;
    @Autowired
    private ActivityService activityService;

    /**
     * Gets the log of a chat in the format
     * {
     *  "activity": "1214121678",
     *  "messages": []
     * }
     *
     * @param groupId the activity you want to find the chat log of
     */
    @GetMapping(value = "/chat/{groupId}", produces = "application/json")
    public ResponseEntity getMessageLog(@PathVariable Integer groupId) {
        HttpHeaders header = new HttpHeaders();

        Activity activity = activityService.getActivity(groupId);
        HashMap<String, String> body = new HashMap<>();
        if (activity != null) {
            List<Chat> messageList = chatService.getMessages(activity);
            if (messageList != null) {
                StringBuilder messageJson = new StringBuilder();
                messageJson.append("{\"activity\":" + "\"").append(groupId)
                    .append("\",").append("\"messages\" : [");
                for (Chat c : messageList) {
                    messageJson.append(c.toJson()).append(",");
                }

                messageJson.append("]");
                //trailing comma
                if (!messageList.isEmpty()) {
                    messageJson.deleteCharAt(messageJson.length() - 2);
                }
                messageJson.append("}");
                return ResponseEntity
                    .ok()
                    .headers(header)
                    .body(messageJson.toString());
            }
            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }
        body.put("error", "the activity does not exist");
        return ResponseEntity
            .badRequest()
            .headers(header)
            .body(formatJson(body));
    }


    /**
     * Websocket-messages are automatically sent here
     */
    @MessageMapping("/chat/{activityId}")
    public void sendMessage(@DestinationVariable Integer activityId, @Payload String message)
        throws ParseException {
        log.info("recieved chat message to id: " + activityId + " with message: " + message);
        JSONParser parser = new JSONParser();
        JSONObject chatJson = (JSONObject) parser.parse(message);

        Activity activity = activityService.getActivity(activityId);
        User user = userService.getUser(chatJson.getAsNumber("userId").intValue());

        if (activity != null) {
            Chat newChat;
            chatJson.put("user", user);
            chatJson.remove("userId");
            try {
                newChat = new Chat(activity, user, String.valueOf(chatJson.get("message")));
            } catch (IllegalArgumentException e) {
                log.error("user not connected to activity, discarding message");
                return;
            }
            String json = "{" +
                "\"user\":" + user.toJSON() +
                ",\"message\":" + "\"" + chatJson.get("message") + "\"" +
                ",\"timestamp\":" + newChat.getTimeStamp().getTime() +
                "}";

            int counter = 0;
            boolean succeeded;
            do {
                newChat.setChatId(getRandomID());
                //avoid infinte loop incase of database error
                succeeded = chatService.saveChat(newChat);
            } while (counter++ < 5 && !succeeded);
            //if the counter did not reach threshold, save chat succeeded
            if (succeeded) {
                template.convertAndSend("/client/chat/" + activityId, json);
            } else {
                template.convertAndSend("{\"error\":\"could not save chat message\"");
            }
        }
    }
}
