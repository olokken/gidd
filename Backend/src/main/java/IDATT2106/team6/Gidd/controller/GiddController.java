package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.service.ActivityService;
import java.net.URI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class GiddController {

    @Autowired
    ActivityService activityService;

    @GetMapping(value = "/test")
    public ResponseEntity getTestPage() {
        int[] a = {1, 2, 3};
        return ResponseEntity
            .created(URI
                .create(String.format("%s", "hi")))
            .body(a);
    }

    @GetMapping(value = "/somepage")
    public String getpage() {
        return "hello this is just a random page";
    }
}
