package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.TagService;
import IDATT2106.team6.Gidd.service.UserService;
import java.net.URI;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import javax.management.BadAttributeValueExpException;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class GiddController {
    @Autowired
    private ActivityService activityService;
    @Autowired
    private EquipmentService equipmentService;
    @Autowired
    private UserService userService;
    @Autowired
    private TagService tagService;

    @GetMapping("/hello")
    public ResponseEntity home() {
        activityService.doNothing();
        return ResponseEntity
            .ok()
            .body("hi");
    }

    @PostMapping(value = "/activity", consumes = "application/json", produces = "application/json")
    public ResponseEntity newActivity(@RequestBody Map<String, String> map) {
        int newId;
        try{
            //TODO Check that the user exists
            User user = userService.getUser(Integer.parseInt(map.get("userId")));
            newId = getRandomID();
            String title = map.get("title").trim();
            Timestamp newTime = Timestamp.valueOf(map.get("time"));
            int repeat = Integer.parseInt(map.get("repeat"));
            int capacity = Integer.parseInt(map.get("capacity"));
            int groupId = Integer.parseInt(map.get("groupId"));
            String description = map.get("description");
            byte[] image = binaryToByte(map.get("image"));
            ActivityLevel activityLevel = ActivityLevel.valueOf(map.get("activityLevel"));
            List<Tag> tags = splitTags(map.get("tags"));
            double latitude = Double.parseDouble(map.get("latitude"));
            double longitude = Double.parseDouble(map.get("longitude"));

            Activity newActivity = new Activity(newId,
                title, newTime, repeat, user,
                capacity, groupId, description, image,
                activityLevel, tags, latitude, longitude, null);

            newActivityValidId(newActivity);

        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .badRequest()
                .body(e.getStackTrace());
        }

        return ResponseEntity
            //TODO Return correct newId
            .created(URI.create(String.format("/activity/%d", newId)))
            .body("Woohoo,");
    }


    private void newActivityValidId(Activity activity) {
        boolean created;
        do{
            activity.setActivityId(getRandomID());
            created = activityService.addActivity(activity);
        }
        while(!created);
    }

    private int getRandomID() {
        Random rand = new Random();
        return rand.nextInt();
    }

    private int toInt(Object o) throws Exception {
        return 0;
    }

    private List<Tag> splitTags(String tagString) {
        ArrayList<String> tagNames = new ArrayList<>(Arrays.asList(tagString.split(",")));
        ArrayList<Tag> tags = new ArrayList<>();
        for (String name:
             tagNames) {
            Tag tag = tagService.getTag(name);

            if(tag==null){
                tag = new Tag(-1, name);
                tagService.addTag(tag);
            }

            tags.add(tag);
        }

        return tags;
    }

    private byte[] binaryToByte(String bin) {
        List<Byte> list = new ArrayList<>();

        for(String str : bin.split("(?<=\\G.{8})")) {
            list.add(Byte.parseByte(str, 2));
        }

        Byte[] bytes = list.toArray(new Byte[list.size()]);
        return ArrayUtils.toPrimitive(bytes);
    }

}

