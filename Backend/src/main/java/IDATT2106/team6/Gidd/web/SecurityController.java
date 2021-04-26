package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.service.*;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.MapTokenRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import static IDATT2106.team6.Gidd.web.ControllerUtil.*;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/security")
public class SecurityController {
    private static Logger log = new Logger(SecurityController.class.toString());
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

    @ResponseBody
    @RequestMapping("/security/token/generate")
    public Map<String, Object> generateToken(@RequestParam(value = "subject") String subject) {
        String token = securityService.createToken(subject, (2 * 1000 * 60));
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", token);
        //TODO Return JSON
        return map;
    }

    @MapTokenRequired
    @ResponseBody
    @RequestMapping("/security/token/validate")
    public ResponseEntity validateToken(@RequestBody Map<String, Object> map) {
        log.info("received request at /security/token/validate with valid token");
        Map<String, String> body = new HashMap<>();

        body.put("result", "true");

        return ResponseEntity
                .ok()
                .body(formatJson(body));
    }

    @ResponseBody
    @RequestMapping("/security/get/subject")
    public Map<String, Object> getSubject(@RequestParam(value = "token") String token) {
        String subject = securityService.getSubject(token);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", subject);
        return map;
    }

}
