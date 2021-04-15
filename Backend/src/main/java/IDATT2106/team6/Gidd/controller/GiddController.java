package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.UserService;
import java.net.URI;
import java.sql.Timestamp;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
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

        //Kalle insert-metode helt til den blir true

        ArrayList<ActivityUser> activityUsers = new ArrayList<>();
        ArrayList<Activity> activities = activityService.getAllActivities();

        for(Activity a : activities){
            activityUsers.addAll(a.getRegisteredParticipants());
        }

        ArrayList<Integer> ids = new ArrayList<>();

        for(ActivityUser au : activityUsers){
            ids.add(au.getId());
        }

        while(ids.contains(id)){
            id = getRandomID();
        }
        HttpHeaders header = new HttpHeaders();


        if(userService.addUserToActivity(id, activity, user, time)){
            if(activityService.addUserToActivity(id, activity, user, time)){
                header.add("Status", "200 OK");
                header.add("Content-Type", "application/json; charset=UTF-8");

                return ResponseEntity
                        .ok()
                        .headers(header)
                        .body("Added to activity");
            }
            userService.removeActivity(id, user);
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something is wrong with the activity");
        }
        header.add("Status", "400 BAD REQUEST");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
                .badRequest()
                .headers(header)
                .body("Something is wrong with the user");

    }

    @GetMapping(value = "/testGetAllActivitiesForUser", consumes = "application/json", produces = "application/json")
    public ResponseEntity getAllActivitiesForUser(@RequestBody HashMap<String, Object> map){
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));

        HttpHeaders header = new HttpHeaders();

        if(user == null){
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something is wrong with the user");
        }

        List<ActivityUser> activityUser = user.getActivities();

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
                .ok()
                .headers(header)
                .body(activityUser.toString());
    }

    @DeleteMapping(value = "/testDeleteActivitiesToUser", consumes = "application/json", produces = "application/json")
    public ResponseEntity deleteActivitiesToUser(@RequestBody HashMap<String, Object> map){
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        Activity activity = activityService.findActivity(Integer.parseInt(map.get("activityId").toString()));

        HttpHeaders header = new HttpHeaders();

        if(user == null){
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something is wrong with the user");
        }

        if(activity == null){
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something is wrong with the activity");
        }

        int activityUserId = userService.getActivityUser(activity, user);

        ActivityUser activityUser = userService.getActivityUserById(activityUserId);
        if(activityUser == null){
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("The user is not registered to the activity");
        }
        if(!userService.deleteConnection(activityUser) || !userService.removeActivity(activityUserId, user) || !activityService.removeUserFromActivity(activityUserId, activity)){
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something wrong happened when trying to delete");
        }

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");
        return ResponseEntity
                .ok()
                .headers(header)
                .body("lol");
    }

    private int getRandomID(){
        Random rand = new Random();
        return rand.nextInt();
    }
}
