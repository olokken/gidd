package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.service.*;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;

import static IDATT2106.team6.Gidd.web.GiddController.formatJson;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/tag")
public class TagController {
    private static Logger log = new Logger(ActivityController.class.toString());
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

    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity getAllTags() {
        log.debug("Received GetMapping at '/tag'");
        try {
            List<Tag> tags = tagService.getAllTags();

            return ResponseEntity
                    .ok()
                    .body(tags);
        } catch (Exception e) {
            log.error("An unexpected error was caught while getting all tags: " +
                    e.getCause() + " with message" + e.getCause().getMessage());
            HashMap<String, String> body = new HashMap<>();
            body.put("error", "something went wrong");

            return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
        }
    }
}
