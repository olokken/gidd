package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityEquipment;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.Equipment;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.SecurityService;
import IDATT2106.team6.Gidd.service.TagService;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.TokenRequired;
import java.net.URI;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import javax.naming.directory.InvalidAttributesException;
import org.apache.commons.lang3.ArrayUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin
@Controller
public class GiddController {
    private Logger log = new Logger(GiddController.class.toString());
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

    @GetMapping("/aop/test")
    @TokenRequired
    public ResponseEntity home(){
        activityService.doNothing();
        return ResponseEntity
            .ok()
            .body("hi");
    }

    @ResponseBody
    @TokenRequired
    @GetMapping(value="/tokenTestAOP")
    public Map<String,Object> tokenTestAOP(@RequestParam(value="userid") String userid){
        Map<String,Object> map = new LinkedHashMap<>();
        map.put("result", "worked?!");
        return map;
    }

    @ResponseBody
    @RequestMapping("/security/generate/token")
    public Map<String,Object> generateToken(@RequestParam(value="subject") String subject) {
        String token = securityService.createToken(subject, (2 * 1000 * 60));
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", token);
        //TODO Return JSON
        return map;
    }

    @ResponseBody
    @RequestMapping("/security/get/subject")
    public Map<String, Object> getSubject(@RequestParam(value="token") String token) {
        String subject = securityService.getSubject(token);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", subject);
        return map;
    }

    @ResponseBody
    @GetMapping("/hello2")
    @TokenRequired
    public Map<String, Object> testAOPAnnotation() {
        Map<String,Object> map = new LinkedHashMap<>();
        map.put("result", "Aloha");
        return map;
    }

    @PostMapping("/user")
    public ResponseEntity registerUser(@RequestBody HashMap<String, Object> map){
        //      TODO Error handling
        //      Make sure the user's email isn't already registered
        //      Return Exception to user
        log.info("recieved postmapping to /user: " + map.toString());
        User result = userService.registerUser(
                getRandomID(),
                map.get("email").toString(),
                map.get("password").toString(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                Integer.parseInt(map.get("phoneNumber").toString()),
                ActivityLevel.valueOf(map.get("activityLevel").toString()));
        log.info("created user: " + result.toString());
        Map<String, String> body = new HashMap<>();
        HttpHeaders header = new HttpHeaders();

        header.add("Content-Type", "application/json; charset=UTF-8");
        log.info("created user " + result.toString());
        if(result != null){
            log.info("created user");
            header.add("Status", "201 CREATED");

            body.put("id", String.valueOf(result.getUserId()));

            return ResponseEntity.ok()
                    .headers(header)
                    .body(formatJson(body));
        }
        log.error("Created user is null, does the user already exist?");
        header.add("Status", "400 BAD REQUEST");
        body.put("error", "Created user is null, does the user already exist?");
        return ResponseEntity.ok()
                .headers(header).body(formatJson(body));
    }

    @PostMapping("/login")
    public ResponseEntity loginUser(@RequestBody Map<String, Object> map){
        log.info("recieved postmapping to /login " + map.toString());
        HttpHeaders header = new HttpHeaders();
        boolean result = userService.login(map.get("email").toString(), map.get("password").toString());
        Map<String, String> body = new HashMap<>();
        if(result){
            log.info("logged in user with email " + map.get("email").toString());
            body.put("id", String.valueOf(userService.getUser(map.get("email").toString()).getUserId()));
            header.add("Status", "200 OK");
            return ResponseEntity.ok()
                    .headers(header)
                    .body(formatJson(body));
        }
        log.error("unable to login user with email: " + map.get("email").toString());
        header.add("Status", "403 Forbidden");
        body.put("error", "unable to login user with email: " + map.get("email").toString());
        return ResponseEntity.ok()
                .headers(header).body(formatJson(body));
    }

    @PostMapping(value = "/activity", consumes = "application/json", produces = "application/json")
    public ResponseEntity newActivity(@RequestBody Map<String, Object> map) {
        log.debug("Recieved new activity: " + map.toString());
        int newId;
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        try{
            User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
            if(user==null){
                log.error("User is null, throwing exception");
                throw new InvalidAttributesException("User does not exist");
            }
            newId = 0;

            Activity newActivity = mapToActivity(map, newId, user);
            log.debug("Created new activity: " + newActivity.getActivityId());
            newId = newActivityValidId(newActivity);
            log.debug("new activity id: " + newId);

            map.get("equipment");
            registerEquipmentToActivity(newId, map.get("equipmentList").toString());
        } catch (InvalidAttributesException e) {
            log.error("InvalidattributesException, invalid userID recieved " + e.getMessage());
            body.put("error", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body(formatJson(body));
        } catch(Exception e) {
            body.put("error", "unknown error: " + e.getMessage());
            log.error("unexplained error caught " + e + "; local:" + e.getLocalizedMessage());
            return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
        }
        log.info("Activity created successfully");
        body.put("id", "" + newId);
        return ResponseEntity
                .created(URI.create(String.format("/activity/%d", newId)))
                .body(formatJson(body));
    }

    @PostMapping(value = "/activity/{activityId}/equipment/{equipmentId}/user")
    public ResponseEntity registerUserToEquipment(@RequestBody HashMap<String, Object> map){
        log.debug("Received PostMapping to '/activity/{activityId}/equipment/{equipmentId}/user'");
        int activityId = Integer.parseInt(map.get("activityId").toString());
        Activity activity = activityService.getActivity(activityId);

        log.debug("Finding activity with id " + activityId);
        if(activity == null){
            log.error("The activity is null");
            HttpHeaders header = new HttpHeaders();
            HashMap<String, String> body = new HashMap<>();

            body.put("error", "The activity does not exist");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            log.debug("Returning error message");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        int equipmentId = Integer.parseInt(map.get("equipmentId").toString());
        Equipment equipment = equipmentService.getEquipment(equipmentId);

        log.debug("Finding equipment with id " + equipmentId);
        if(equipment == null){
            log.error("The equipment is null");
            HttpHeaders header = new HttpHeaders();
            HashMap<String, String> body = new HashMap<>();

            body.put("error", "The equipment does not exist");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            log.debug("Returning error message");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        int userId = Integer.parseInt(map.get("userId").toString());
        User user = userService.getUser(userId);

        log.debug("Finding user with id " + userId);
        if(user == null){
            log.error("The user is null");
            HttpHeaders header = new HttpHeaders();
            HashMap<String, String> body = new HashMap<>();

            body.put("error", "The user does not exist");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            log.debug("Returning error message");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        List<ActivityEquipment> equipments = activity.getEquipments();

        log.debug("Finding connection between activity and equipment");
        for(ActivityEquipment ae : equipments){
            if(ae.getEquipment().getEquipmentId() == equipmentId){
                log.debug("Registering user to equipment in activity");
                activity.getEquipments().remove(ae);
                ae.setBringerId(userId);
                activity.addEquipment(ae);
                activityService.updateEquipment(ae, activity);

                HttpHeaders header = new HttpHeaders();
                HashMap<String, String> body = new HashMap<>();

                body.put("activityId", String.valueOf(activityId));
                body.put("equipmentId", String.valueOf(equipmentId));
                body.put("userId", String.valueOf(userId));
                header.add("Status", "200 OK");
                header.add("Content-Type", "application/json; charset=UTF-8");
                log.debug("Returning the id of activity: " + activityId + ", equipment: " + equipment + ", user: " + userId);
                return ResponseEntity
                        .ok()
                        .headers(header)
                        .body(formatJson(body));
            }
        }

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        body.put("error", "The equipment is not registered to the activity");
        header.add("Status", "400 BAD REQUEST");
        header.add("Content-Type", "application/json; charset=UTF-8");
        log.error("The equipment is not registered to the activity");
        return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
    }

    @PostMapping(value = "/user/activity", consumes = "application/json", produces = "application/json")
    public ResponseEntity registerUserToActivity(@RequestBody HashMap<String, Object> map){
        log.debug("Received PostMapping to '/user/{userId}/activity with userId" + Integer.parseInt(map.get("userId").toString()) + " and activityId " + Integer.parseInt(map.get("activityId").toString()));
        Timestamp time = new Timestamp(new Date().getTime());

        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        Activity activity = activityService.findActivity(Integer.parseInt(map.get("activityId").toString()));

        HttpHeaders header = new HttpHeaders();

        if(user == null){
            log.error("User is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(activity == null){
            log.error("Activity is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The activity does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        //Legge inn sjekk om den allerede er registrert
        List<ActivityUser> activityUser = user.getActivities();
        ArrayList<Integer> activityIds = new ArrayList<>();

        for(ActivityUser as : activityUser){
            activityIds.add(as.getActivity().getActivityId());
        }

        if(activityIds.contains(activity.getActivityId())){
            log.error("The user is already registered to the activity");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user is already registered to the activity");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        int id = getRandomID();

        //Kalle insert-metode helt til den blir true

        ArrayList<ActivityUser> activityUsers = new ArrayList<>();
        ArrayList<Activity> activities = activityService.getAllActivities();

        for(Activity a : activities){
            activityUsers.addAll(a.getRegisteredParticipants());
        }

        log.debug("Generating random id...");
        ArrayList<Integer> ids = new ArrayList<>();

        for(ActivityUser au : activityUsers){
            ids.add(au.getId());
        }

        while(ids.contains(id)){
            id = getRandomID();
        }


        if(userService.addUserToActivity(id, activity, user, time)){
            if(activityService.addUserToActivity(id, activity, user, time)){
                log.debug("The registration was successful");
                header.add("Status", "200 OK");
                header.add("Content-Type", "application/json; charset=UTF-8");

                Map<String, String> body = new HashMap<>();

                body.put("userId", String.valueOf(user.getUserId()));
                body.put("activityId", String.valueOf(activity.getActivityId()));

                return ResponseEntity
                        .ok()
                        .headers(header)
                        .body(formatJson(body));
            }
            log.error("Something wrong happened when trying to register the user to the activity");
            userService.removeActivity(id, user);
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "Something wrong happened with the activity when trying to register");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }
        log.error("Something wrong happened when trying to register the activity to the user");
        header.add("Status", "400 BAD REQUEST");
        header.add("Content-Type", "application/json; charset=UTF-8");

        Map<String, String> body = new HashMap<>();

        body.put("error", "Something wrong happened with the user when trying to register");
        return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
    }


    @PutMapping(value = "/user/{id}")
    public ResponseEntity editUser(@RequestBody Map<String, Object> map, @PathVariable Integer id){
        log.info("recieved a put mapping for user with id: " + id + " and map " + map.toString());
        HttpHeaders header = new HttpHeaders();
        Map<String, String> body = new HashMap<>();
        header.add("Content-Type", "application/json; charset=UTF-8");

        if(!validateStringMap(map)){
            log.error("returning error about null/blank fields in user put mapping " + map.toString());
            body.put("error", "one or more json-fields is null/blank");
            return ResponseEntity.badRequest().body(formatJson(body));
        }

        try {
            Integer.parseInt(map.get("phoneNumber").toString());
        } catch (NumberFormatException e) {
            log.error("phone number cannot be parsed to number " + map.toString());
            body.put("error", "phone number is not numeric");
            return ResponseEntity.badRequest().body(formatJson(body));
        }

        boolean result = userService.updateUser(
                id,
                map.get("email").toString(),
                map.get("password").toString(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                Integer.parseInt(map.get("phoneNumber").toString()),
                ActivityLevel.valueOf(map.get("activityLevel").toString()));

        log.info("edited user " + map.toString());
        if(result){
            log.info("created user");
            header.add("Status", "201 CREATED");

            body.put("id", String.valueOf(id));

            return ResponseEntity.ok()
                    .headers(header)
                    .body(formatJson(body));
        }
        log.error("User could not be edited, are you sure the user exists");
        header.add("Status", "400 BAD REQUEST");
        body.put("error", "could not edit user are you sure the user exists?");
        return ResponseEntity.badRequest().body(formatJson(body));
    }

    @PutMapping(value="/activity/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity editActivity(@RequestBody Map<String, Object> map, @PathVariable("id") int actId){
        log.info("recieved putmapping to /activity/{id}");
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        log.debug("User with id recieved " + user.toString());
        Activity activity = activityService.getActivity(actId);
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        log.info("old activity " + activity.getActivityId());
        if(activity==null || user == null){
            body.put("error", "user or activity is null");
            log.error("activity or user is null, returning error");
            log.debug("Activity: " + (activity == null));
            log.debug("User: " + (user==null));
            return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body(formatJson(body));
        }

        activity.setTitle(map.get("title").toString());
        activity.setTime(Timestamp.valueOf(map.get("time").toString()));
        activity.setDescription(map.get("description").toString());
        activity.setCapacity(Integer.parseInt(map.get("capacity").toString()));
        activity.setActivityLevel(ActivityLevel.valueOf(map.get("activityLevel").toString()));
        log.info("new activity: " + activity.getActivityId());
        boolean edited = activityService.editActivity(activity);
        if(!edited){
            body.put("error", "activity was not edited");
            log.info("activity is not edited returning error");
            return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body("didnt work here either sad");
        }

        return ResponseEntity
                .ok()
                .headers(headers).body(formatJson(body));
    }

    @GetMapping(value = "/activity/{activityId}", produces = "application/json")
    public ResponseEntity getActivity(@PathVariable Integer activityId) throws JSONException {
        log.debug("Received GetMapping to '/activity/{activityId}' with activityId " + activityId);
        Activity activity = activityService.getActivity(activityId);

        if(activity == null){
            log.error("The activity is null");
            HttpHeaders header = new HttpHeaders();
            HashMap<String, String> body = new HashMap<>();

            body.put("error", "The activity does not exist");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            log.debug("Returning error message");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        HttpHeaders header = new HttpHeaders();

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");
        log.debug("Returning activity object " + activity.getActivityId());
        return ResponseEntity
                .ok()
                .headers(header)
                .body(activity.toString());
    }

    @GetMapping(value = "/activity")
    public ResponseEntity getActivities(@RequestParam(value="searchWord", required = false) String searchValue, @RequestParam(value = "activityLevel", required = false) Integer activityLevel, @RequestParam(value="tagDescription", required = false) String tagDescription) throws JSONException {
        log.debug("Received GetMapping to '/activity' with Query Params");
        List<Activity> activities;
        if(searchValue == null && activityLevel == null && tagDescription == null){
            activities = activityService.getAllActivities();
        }
        else if(searchValue == null && tagDescription == null){
            log.debug("Searching for activity level to activity");
            log.debug("Activity level is " + activityLevel);
            activities = activityService.filterByActivityLevel(activityLevel);
        }else if(tagDescription == null && activityLevel == null){
            log.debug("Searching for title to activity");
            log.debug("Search word is " + searchValue);
            activities = activityService.searchForActivityByTitle(searchValue);
        }else{
            log.debug("Filtering activities with tag " + tagDescription);
            Tag tag = tagService.getTag(tagDescription);
            if(tag == null){
                log.error("The tag is null");
                HttpHeaders header = new HttpHeaders();
                HashMap<String, String> body = new HashMap<>();

                body.put("error", "The tag does not exist");
                header.add("Status", "400 BAD REQUEST");
                header.add("Content-Type", "application/json; charset=UTF-8");
                log.debug("Returning error message");
                return ResponseEntity
                        .badRequest()
                        .headers(header)
                        .body(formatJson(body));
            }
            int tagId = tag.getTagId();
            List<Object> activityIds = activityService.filterByTag(tagId);
            activities = new ArrayList<>();
            for(Object i : activityIds){
                if(!(activityService.getActivity((Integer)i) == null)){
                    activities.add(activityService.getActivity((Integer)i));
                }
            }
        }

        if(activities == null){
            log.error("The activities are null");
            HttpHeaders header = new HttpHeaders();
            HashMap<String, String> body = new HashMap<>();

            body.put("error", "An error occurred when trying to filter");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            log.debug("Returning error message");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        log.debug(String.format("There are %d activities", activities.size()));

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        body.put("activity", activities.toString());
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");
        log.debug(String.format("Returning %d activities", activities.size()));
        return ResponseEntity
                .ok()
                .headers(header)
                .body("{\"activities\": \n" + activities.toString() + "\n}");
    }

    @GetMapping(value = "/activity/{id}/user", produces = "application/json")
    public ResponseEntity getAllUsersFromActivity(@PathVariable Integer id){
        log.info("recieved get mapping /activity/" + id + "/user");
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> userMap = new HashMap<>();
        HashMap<String, String> errorCode = new HashMap<>();
        List<User> users = activityService.getUserFromActivity(id);
        if(users.size() != 0){
            log.info("users found for activity with id " + id);
            userMap.put("user","");
            users.stream().forEach(u -> userMap.put("user", userMap.get("user") + u.getUserId() + ","));
            //remove trailing comma
            userMap.put("user", userMap.get("user").substring(0, userMap.get("user").length() - 1));
            return ResponseEntity.ok().headers(headers).body(formatJson(userMap));
        }
        log.error("no activity was found with id: " + id);
        errorCode.put("error", "no activity found");
        return ResponseEntity.badRequest().headers(headers).body(formatJson(errorCode));
    }

    @GetMapping(value = "/user/{userId}", produces = "application/json")
    public ResponseEntity getSingleUser(@PathVariable Integer userId){
        log.debug("recieved single user get " + userId);
        User user = userService.getUser(userId);
        HttpHeaders header = new HttpHeaders();
        if(user != null){
            return ResponseEntity
                .ok()
                .headers(header)
                .body(user.toJSON());
        }
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("error", "are you sure the user exists?");
        return ResponseEntity
            .badRequest()
            .headers(header)
            .body(formatJson(hashMap));
    }

    @GetMapping(value = "/user/{userId}/activity", produces = "application/json")
    public ResponseEntity getAllActivitiesForUser(@PathVariable Integer userId){
        log.debug("Received GetMapping to '/user/{userId}/activity' with userId " + userId);
        User user = userService.getUser(userId);

        HttpHeaders header = new HttpHeaders();

        if(user == null){
            log.error("The user is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user does not exist");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        log.debug("Getting all activities " + user.toString() + " is registered to");
        List<ActivityUser> activityUser = user.getActivities();

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        Map<String, String> body = new HashMap<>();

        StringBuilder sb = new StringBuilder();

        for(ActivityUser au : activityUser){
            sb.append(au.getActivity().getActivityId());
            sb.append(",");
        }

        if(!activityUser.isEmpty()) {
            sb.delete(sb.length() - 1, sb.length());
        }

        log.debug("Returning activities");

        body.put("activityIds", sb.toString());
        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @DeleteMapping(value = "/user/{userId}/activity/{activityId}", produces = "application/json")
    public ResponseEntity deleteActivityToUser(@PathVariable Integer userId, @PathVariable Integer activityId){
        log.debug("Received DeleteMapping to /user/{userId}/activity/{activityId} with userId being " + userId + " and activityId being " + activityId);
        User user = userService.getUser(userId);
        Activity activity = activityService.findActivity(activityId);

        HttpHeaders header = new HttpHeaders();
        if(user == null){
            log.error("User is null");
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(activity == null){
            log.error("Activity is null");
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The activity does not exist");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        List<ActivityUser> activityUsers = user.getActivities();
        List<Integer> activitiesIds = new ArrayList<>();

        for(ActivityUser au : activityUsers){
            activitiesIds.add(au.getActivity().getActivityId());
        }

        if(!activitiesIds.contains(activityId)){
            log.error("There is no connection between user and activity");
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user is not registered to the activity");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        int activityUserId = userService.getActivityUser(activity, user);

        ActivityUser activityUser = userService.getActivityUserById(activityUserId);
        if(activityUser == null){
            log.error("There is no connection between user and activity");
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user is not registered to the activity");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }
        if(!userService.deleteConnection(activityUser) || !userService.removeActivity(activityUserId, user) || !activityService.removeUserFromActivity(activityUserId, activity)){
            log.error("An error happened during the deletion");
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "Something went wrong when trying to delete");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        log.debug("The deletion was successful");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        Map<String, String> body = new HashMap<>();
        body.put("userId", String.valueOf(user.getUserId()));
        body.put("activityId", String.valueOf(activity.getActivityId()));
        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity deleteUser(@PathVariable Integer id){
        //todo return activity-objects and user id's affected by this user being deleted 
        // aka the activities this user has created
        log.info("recieved deletemapping to user with id " + id);
        HttpHeaders header = new HttpHeaders();
        boolean result = userService.deleteUser(id);
        Map<String, String> body = new HashMap<>();

        if(result){
            log.info("deletion successful");
            header.add("Status", "200 OK");
            return ResponseEntity.ok()
                    .headers(header).body(formatJson(body));
        }

        log.error("unable to delete user with id: " + id);
        body.put("error", "deletion failed, are you sure the user with id " + id + " exists?");
        header.add("Status", "400 BAD REQUEST");
        return ResponseEntity.ok()
                .headers(header).body(formatJson(body));
    }

    //todo - error code when giving too long numbers or strings ?
    @DeleteMapping(value = "/activity/{activityId}")
    public ResponseEntity deleteActivity(@PathVariable Integer activityId){
        List<User> users = activityService.getUserFromActivity(activityId);
                    Map<String, String> body = new HashMap<>();
        HttpHeaders header = new HttpHeaders(); 
        if(activityService.deleteActivity(activityId)){
            log.debug("The deletion was successful");
            header.add("Status", "200 OK");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("activityId", String.valueOf(activityId));
            body.put("users","");
            users.stream().forEach(u -> body.put("user", body.get("user") + u.getUserId() + ","));
            body.put("users", body.get("user").substring(0, body.get("user").length() - 1));

            return ResponseEntity
                    .ok()
                    .headers(header)
                    .body(formatJson(body));    
        }

        body.put("error", "no activity was deleted, are you sure the activity exists");
        return ResponseEntity.badRequest().headers(header).body(formatJson(body));
    }

    private int newActivityValidId(Activity activity) {
		log.info("finding new valid id for an activity");
        boolean created;
        int endId;
        do{
            endId = getRandomID();
			log.debug("attempting id: " + endId);
            if (endId < 0){
                endId = -endId;
            }
            activity.setActivityId(endId);
            created = activityService.addActivity(activity);
			log.debug("creating activity was " + created + " successfull");
        }
        while(!created);
		log.info("final new activity id: " + endId);
        return endId;
    }

    private int getRandomID() {
		log.info("creating new random id");
        int id = new Random().nextInt();
        return ( id > 0 ? id : -id);
    }

    private List<Tag> splitTags(String tagString) {
		log.info("splitting tags");
        ArrayList<String> tagNames = new ArrayList<>(Arrays.asList(tagString.split(",")));
        ArrayList<Tag> tags = new ArrayList<>();
        for (String name : tagNames) {
            Tag tag = tagService.getTag(name);

            if(tag==null){
				log.debug("tag: " + name + " did not exist creating new tag");
                tag = new Tag(-1, name);
                tagService.addTag(tag);
            }
			log.debug("adding tag " + tag.toString());
            tags.add(tag);
        }
		log.debug("final tag list " + tags.toString());	
        return tags;
    }

    private byte[] binaryToByte(String bin) {
		log.debug("binary to byte array");
        List<Byte> list = new ArrayList<>();

        for(String str : bin.split("(?<=\\G.{8})")) {
            list.add((byte) Integer.parseInt(str, 2 ));
        }

        Byte[] bytes = list.toArray(new Byte[list.size()]);
        return ArrayUtils.toPrimitive(bytes);
    }

    private String formatJson(Map values){
		log.debug("formatting json");
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
		log.debug("map: " + map.toString() + " to activity");
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

    private boolean registerEquipmentToActivity(int activityId, String equipment){
        log.debug("Registering " + equipment + " to activity with activity id " + activityId);
        String[] equipmentDescription = equipment.split(",");

        ArrayList<Equipment> equipments = new ArrayList<>();

        log.debug("Checking if the equipment already is registered in the database");
        for (String s : equipmentDescription) {
            if (equipmentService.getEquipmentByDescription(s.trim()) == null) {
                registerEquipment(s.trim());
            }
            equipments.add(equipmentService.getEquipmentByDescription(s.trim()));
        }

        Activity activity = activityService.getActivity(activityId);

        for(Equipment e : equipments) {
            log.debug("Adding [" + e.getEquipmentId() + ":" + e.getDescription() + "] to " + activity.getActivityId());
            ActivityEquipment activityEquipment = new ActivityEquipment(activity, e);
            activity.addEquipment(activityEquipment);
        }
        if(!activityService.addEquipmentToActivity(activity)){
            log.error("The registration failed");
            return false;
        }
        log.debug("The registration was successful");
        return true;
    }

    private void registerEquipment(String description){
        log.debug("Registering " + description + " to equipment");
        equipmentService.registerEquipment(description.toLowerCase());
    }

    private boolean validateStringMap(Map<String, Object> map){
        log.info("validating map values of " + map.toString());
        Iterator it = map.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, String> pair = (Map.Entry)it.next();
            if(pair.getValue().isBlank() || pair.getValue() == null){
                log.error(pair.getKey() + " : " + pair.getValue() + " could not be validated");
                return false;
            } 
        }
        log.info("map: " + map.toString() + " validated");
        return true;
    }
}
