package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.service.ActivityService;

import java.util.HashMap;
import java.util.Map;

import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.TagService;
import IDATT2106.team6.Gidd.service.UserService;
import java.net.URI;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import javax.naming.directory.InvalidAttributesException;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.coyote.Response;
import java.util.Iterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
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
    public ResponseEntity newActivity(@RequestBody Map<String, Object> map) {
        int newId;
        HttpHeaders headers = new HttpHeaders();
        try{
            User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
            if(user==null){
                throw new InvalidAttributesException("User does not exist");
            }
            newId = 0;

            Activity newActivity = mapToActivity(map, newId, user);

            newId = newActivityValidId(newActivity);

            //TODO Format ResponseEntities in accordance to project standard
        } catch (InvalidAttributesException e) {
            System.out.println("An activity failed to be created. Invalid userID received.");
            return ResponseEntity
                .badRequest()
                .headers(headers)
                .body("An invalid userID was received.");
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .badRequest()
                .body(e.getStackTrace());
        }

        return ResponseEntity
            .created(URI.create(String.format("/activity/%d", newId)))
            .body("Woohoo");
    }

    @PutMapping(value="/activity/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity editActivity(@RequestBody Map<String, Object> map, @PathVariable("id") int actId){
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        Activity activity = activityService.testGetActivity(actId);
        HttpHeaders headers = new HttpHeaders();
        System.out.println(activity);
        if(activity==null || user == null){
            System.out.println("Activity: " + (activity == null));
            System.out.println("User: " + (user==null));
            return ResponseEntity
                .badRequest()
                .headers(headers)
                .body("didnt work sad");
        }

        activity.setTitle(map.get("title").toString());
        activity.setTime(Timestamp.valueOf(map.get("time").toString()));
        activity.setDescription(map.get("description").toString());
        activity.setCapacity(Integer.parseInt(map.get("capacity").toString()));
        activity.setActivityLevel(ActivityLevel.valueOf(map.get("activityLevel").toString()));

        boolean edited = activityService.editActivity(activity);
        if(!edited){
            return ResponseEntity
                .badRequest()
                .headers(headers)
                .body("didnt work here either sad");
        }

        return ResponseEntity
            .ok()
            .headers(headers)
            .body("woohooo worked!!");
    }

    @PostMapping("/user")
    public ResponseEntity registerUser(@RequestBody HashMap<String, Object> map){

        User result = userService.registerUser(
            map.get("email").toString(),
            map.get("password").toString(),
            map.get("firstName").toString(),
            map.get("surname").toString(),
            Integer.parseInt(map.get("phoneNumber").toString()),
            ActivityLevel.valueOf(map.get("activityLevel").toString()));

        Map<String, String> body = new HashMap<>();
        HttpHeaders header = new HttpHeaders();

        header.add("Content-Type", "application/json; charset=UTF-8");

		if(result != null){
            header.add("Status", "201 CREATED");

            body.put("id", String.valueOf(result.getUserId()));

            return ResponseEntity.ok()
                .headers(header)
                .body(formatJson(body));
		}
        header.add("Status", "400 BAD REQUEST");

        return ResponseEntity.ok()
            .headers(header).body(formatJson(body));
}

    @PostMapping("/login")
    public ResponseEntity loginUser(@RequestBody HashMap<String, String> map){
        HttpHeaders header = new HttpHeaders();
		boolean result = userService.login(map.get("email").toString(), map.get("password").toString());
        Map<String, String> body = new HashMap<>();
        if(result){
            body.put("id", String.valueOf(userService.getUser(map.get("email").toString()).getUserId()));
            header.add("Status", "200 OK");
            return ResponseEntity.ok()
                .headers(header)
                .body(formatJson(body));
        }
        header.add("Status", "403 Forbidden");
        return ResponseEntity.ok()
            .headers(header).body(formatJson(body));
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity deleteUser(@PathVariable Integer id){
        HttpHeaders header = new HttpHeaders();
        boolean result = userService.deleteUser(id);
        Map<String, String> body = new HashMap<>();

        if(result){
            header.add("Status", "200 OK");
            return ResponseEntity.ok()
                .headers(header).body(formatJson(body));
        }
        header.add("Status", "400 BAD REQUEST");
        return ResponseEntity.ok()
            .headers(header).body(formatJson(body));
    }

    private int newActivityValidId(Activity activity) {
        boolean created;
        int endId;
        do{
            endId = getRandomID();
            if (endId < 0){
                endId = -endId;
            }
            activity.setActivityId(endId);
            created = activityService.addActivity(activity);
        }
        while(!created);

        return endId;
    }

    private int getRandomID() {
        Random rand = new Random();
        return rand.nextInt();
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

    private String formatJson(Map values){
        String result = "{";
        Iterator it = values.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            String goose = "";

            //todo very scuffed
            try {
                Integer.parseInt(pair.getValue().toString());
            } catch (Exception e) {
                goose = "\"";
            }

            System.out.println("goose: " + goose + " because " + pair.getValue() instanceof String);
            result += "\"" + pair.getKey() + "\":" + goose + pair.getValue() + goose + ",\n";
            it.remove(); // avoids a ConcurrentModificationException
        }
        //remove trailing comma
        return result.substring(0, result.length() - (result.length() > 1 ? 2 : 0)) + "}";
    }

    private Activity mapToActivity(Map<String, Object> map, int actId, User user){
        String title = map.get("title").toString().trim();
        Timestamp newTime = Timestamp.valueOf(map.get("time").toString());
        int repeat = Integer.parseInt(map.get("repeat").toString());
        int capacity = Integer.parseInt(map.get("capacity").toString());
        int groupId = Integer.parseInt(map.get("groupId").toString());
        String description = map.get("description").toString();
        byte[] image = binaryToByte(map.get("image").toString());
        ActivityLevel activityLevel = ActivityLevel.valueOf(map.get("activityLevel").toString().toUpperCase());
        List<Tag> tags = splitTags(map.get("tags").toString());
        double latitude = Double.parseDouble(map.get("latitude").toString());
        double longitude = Double.parseDouble(map.get("longitude").toString());

        return new Activity(actId,
            title, newTime, repeat, user,
            capacity, groupId, description, image,
            activityLevel, tags, latitude, longitude, null);
    }
}
