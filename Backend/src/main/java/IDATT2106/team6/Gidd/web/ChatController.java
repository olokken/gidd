package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.Chat;
import IDATT2106.team6.Gidd.models.FriendGroup;
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

import java.util.ArrayList;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/chat")
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
    @Autowired
    private FriendGroupService friendGroupService;
    @MessageMapping("/{activityId}")
    public void sendMessage(@DestinationVariable Integer groupId, @Payload String message) throws ParseException {
        // Set the message time as now before sending it back to the topic
        log.info("recieved message to group " + groupId);
        JSONParser parser = new JSONParser();
        JSONObject chatJson = (JSONObject) parser.parse(message);
        Activity activity = activityService.getActivity(chatJson.getAsNumber("activityId").intValue());
        User user = userService.getUser(chatJson.getAsNumber("userId").intValue());

        Chat newChat = new Chat(activity, user, String.valueOf(chatJson.get("message")));
        template.convertAndSend("/client/chat/" + groupId, message);
        if(chatService.saveChat(newChat)){
            template.convertAndSend("/client/chat/" + groupId, message);
        }
        else {
            template.convertAndSend("{\"error\":\"could not save chat message\"");
        }
    }

    @GetMapping("/{groupId}/message")
    public ResponseEntity getMessageLog(@PathVariable Integer groupId){
        ArrayList<Chat> messages = new ArrayList<>();
        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<String, String>();
        //todo get a list of all messages in messageservice
        /*
         ArrayList<List> messageList = messageService.getAllMessages(groupId);
         if(messageList != null){
            return ResponseEntity
                .ok()
                .headers(header)
                .body(messages.toString();
        }
        return ResponseEntity
            .badRequest()
            .headers(header)
            .body(formatJson(body));
         */
        return null;
    }

}
