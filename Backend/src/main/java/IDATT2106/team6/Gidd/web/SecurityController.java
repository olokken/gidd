package IDATT2106.team6.Gidd.web;

import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;

import IDATT2106.team6.Gidd.service.SecurityService;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.MapTokenRequired;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/security")
public class SecurityController {
    private static Logger log = new Logger(SecurityController.class.toString());
    @Autowired
    private SecurityService securityService;

    @ResponseBody
    @RequestMapping("/token/generate")
    public Map<String, Object> generateToken(@RequestParam(value = "subject") String subject) {
        String token = securityService.createToken(subject, (1000 * 60 * 60 * 24));
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", token);
        //TODO Return JSON
        return map;
    }

    @MapTokenRequired
    @ResponseBody
    @RequestMapping("/token/validate")
    public ResponseEntity validateToken(@RequestBody Map<String, Object> map) {
        log.info("received request at /security/token/validate with valid token");
        Map<String, String> body = new HashMap<>();

        body.put("result", "true");

        return ResponseEntity
                .ok()
                .body(formatJson(body));
    }

    @ResponseBody
    @RequestMapping("/get/subject")
    public Map<String, Object> getSubject(@RequestParam(value = "token") String token) {
        String subject = securityService.getSubject(token);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", subject);
        return map;
    }

}
