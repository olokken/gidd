package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.UserService;
import java.net.URI;
import java.sql.Timestamp;
import java.util.*;

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

    @GetMapping("/hello")
    public ResponseEntity home(){
        activityService.doNothing();
        return ResponseEntity
            .ok()
            .body("hi");
    }

    @PostMapping(value = "/testNewUser", consumes = "application/json", produces = "application/json")
    public ResponseEntity newUserTest(@RequestBody User object){
        userService.testNewUser(object);
        return ResponseEntity
            .created(URI.create("/user/id"))
            .body("hihi");
    }

    @PostMapping(value = "/testNewActivity", consumes = "application/json", produces = "application/json")
    public ResponseEntity newActivityTest(@RequestBody HashMap<String, Object> map){
        Timestamp newTime = Timestamp.valueOf(map.get("time").toString());

        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        int newId = getRandomID();

        //TODO Verify that user-input is valid
        activityService.addActivity(    newId,
            map.get("title").toString(), newTime, (int) map.get("repeat"), user,
            (int) map.get("capacity"), (int) map.get("groupId"), map.get("description").toString(), (byte[])map.get("image"),
            ActivityLevel.valueOf(map.get("activityLevel").toString()), (List<Tag>)map.get("tags"), (Double) map.get("latitude"), (Double) map.get("longitude"));
        return ResponseEntity
            .created(URI.create(String.format("/activity/%d", newId)))
            .body("Insert ResponseBody here");
    }

    @PostMapping(value = "/testAddNewActivityForUser", consumes = "application/json", produces = "application/json")
    public ResponseEntity addNewActivityForUser(@RequestBody HashMap<String, Object> map){
        Timestamp time = new Timestamp(new Date().getTime());

        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        Activity activity = activityService.findActivity(Integer.parseInt(map.get("activityId").toString()));

        int id = getRandomID();

        ArrayList<ActivityUser> activityUsers = new ArrayList<>();
        ArrayList<Activity> activities = activityService.getAllActivities();

        for(Activity a : activities){
            activityUsers.addAll(a.getRegisteredParticipants());
        }

        while(activityUsers.contains(id)){
            id = getRandomID();
        }

        userService.addUserToActivity(id, activity, user, time);
        activityService.addUserToActivity(id, activity, user, time);
        return ResponseEntity
                .created(URI.create(String.format("/bytt/%d", id)))
                .body("Added to event");
    }

    private int getRandomID(){
        Random rand = new Random();
        return rand.nextInt();
    }
}
