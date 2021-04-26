package IDATT2106.team6.Gidd.web;

import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;

import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.service.TagService;
import IDATT2106.team6.Gidd.util.Logger;
import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/tag")
public class TagController {
    private static Logger log = new Logger(ActivityController.class.toString());
    @Autowired
    private TagService tagService;

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
