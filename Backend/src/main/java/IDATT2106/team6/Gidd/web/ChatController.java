package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.Chat;
import IDATT2106.team6.Gidd.service.*;
import IDATT2106.team6.Gidd.util.Logger;
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
    private ActivityService activityService;
    @Autowired
    private EquipmentService equipmentService;
    @Autowired
    private UserService userService;
    @Autowired
    private TagService tagService;
    @Autowired
    private SecurityService securityService;
    @Autowired
    private FriendGroupService friendGroupService;
    @Autowired
    private SimpMessagingTemplate template;

    @MessageMapping("/{groupId}")
    public void sendMessage(@DestinationVariable Integer groupId, @Payload String message) {
        // Set the message time as now before sending it back to the topic
        log.info("recieved message to group " + groupId);
        template.convertAndSend("/client/chat/" + groupId, message);
        //todo save in database
        // if(messageService.saveMessage(groupId, message)){
        //}
    }

    @GetMapping("/{groupId}/message")
    public ResponseEntity sendMessageLog(@PathVariable Integer groupId){
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
