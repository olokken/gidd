package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.*;
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
import java.util.*;
import javax.naming.directory.InvalidAttributesException;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.coyote.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;
import org.slf4j.LoggerFactory;
import IDATT2106.team6.Gidd.util.*;

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

    @GetMapping("/hello")
    public ResponseEntity home(){
        activityService.doNothing();
        return ResponseEntity
            .ok()
            .body("hi");
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
            log.debug("Created new activity: " + newActivity.toString());
            newId = newActivityValidId(newActivity);
            log.debug("new activity id: " + newId);
        } catch (InvalidAttributesException e) {
            log.error("InvalidattributesException, invalid userID recieved " + e.getMessage());
            body.put("error", e.getMessage());
            return ResponseEntity
<<<<<<< HEAD
                    .badRequest()
                    .headers(headers)
                    .body("An invalid userID was received.");
=======
                .badRequest()
                .headers(headers)
                .body(formatJson(body));
>>>>>>> f03d22f (logging controller)
        } catch(Exception e) {
            body.put("error", "unknown error: " + e.getMessage());
            log.error("unexplained error caught " + e.getMessage());
            return ResponseEntity
<<<<<<< HEAD
                    .badRequest()
                    .body(e.getStackTrace());
=======
                .badRequest()
                .body(formatJson(body));
>>>>>>> f03d22f (logging controller)
        }
        log.info("Activity created successfully");
        return ResponseEntity
                .created(URI.create(String.format("/activity/%d", newId)))
                .body("Woohoo");
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
<<<<<<< HEAD
            .body("Insert ResponseBody here");
    }

    @PostMapping(value = "/testAddNewActivityForUser", consumes = "application/json", produces = "application/json")
    public ResponseEntity addNewActivityForUser(@RequestBody HashMap<String, Object> map){
        Timestamp time = new Timestamp(new Date().getTime());

        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        Activity activity = activityService.findActivity(Integer.parseInt(map.get("activityId").toString()));

        HttpHeaders header = new HttpHeaders();

        if(user == null){
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something is wrong with the user");
        }

        if(activity == null){
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("Something is wrong with the activity");
        }

        //Legge inn sjekk om den allerede er registrert
        List<ActivityUser> activityUser = user.getActivities();
        ArrayList<Integer> activityIds = new ArrayList<>();

        for(ActivityUser as : activityUser){
            activityIds.add(as.getActivity().getActivityId());
        }

        if(activityIds.contains(activity.getActivityId())){
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("The user is already registered at the activity");
        }

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

=======
            .body(formatJson(body));
>>>>>>> f03d22f (logging controller)
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
    @PutMapping(value="/activity/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity editActivity(@RequestBody Map<String, Object> map, @PathVariable("id") int actId){
        log.info("recieved putmapping to /activity/{id}");
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        log.debug("User with id recieved " + user.toString());
        Activity activity = activityService.testGetActivity(actId);
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>(); 
        headers.add("Content-Type", "application/json; charset=UTF-8");
        log.info("old activity " + activity.toString());
        if(activity==null || user == null){
            body.put("error", "user or activity is null");
            log.error("activity or user is null, returning error");
            log.debug("Activity: " + (activity == null));
            log.debug("User: " + (user==null));
            return ResponseEntity
<<<<<<< HEAD
                    .badRequest()
                    .headers(headers)
                    .body("didnt work sad");
=======
                .badRequest()
                .headers(headers)
                .body(formatJson(body));
>>>>>>> f03d22f (logging controller)
        }

        activity.setTitle(map.get("title").toString());
        activity.setTime(Timestamp.valueOf(map.get("time").toString()));
        activity.setDescription(map.get("description").toString());
        activity.setCapacity(Integer.parseInt(map.get("capacity").toString()));
        activity.setActivityLevel(ActivityLevel.valueOf(map.get("activityLevel").toString()));
        log.info("new activity: " + activity.toString());
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
                .headers(headers)
<<<<<<< HEAD
                .body("woohooo worked!!");
    }

    @DeleteMapping(value = "/testDeleteActivitiesToUser/{userId}/{activityId}", produces = "application/json")
    public ResponseEntity deleteActivitiesToUser(@PathVariable Integer userId, @PathVariable Integer activityId){
        User user = userService.getUser(userId);
        Activity activity = activityService.findActivity(activityId);

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

        List<ActivityUser> activityUsers = user.getActivities();
        List<Integer> activitiesIds = new ArrayList<>();

        for(ActivityUser au : activityUsers){
            activitiesIds.add(au.getActivity().getActivityId());
        }

        if(!activitiesIds.contains(activityId)){
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body("The user is not registered to the activity");
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
                .body("It work");
=======
                .body(formatJson(body));
        }
        log.info("activity is changed, returning success");
        return ResponseEntity
            .ok()
            .headers(headers)
            .body(formatJson(body));
>>>>>>> f03d22f (logging controller)
    }

    private int getRandomID(){
        Random rand = new Random();
        return rand.nextInt();
    }
    @PostMapping("/user")
    public ResponseEntity registerUser(@RequestBody HashMap<String, Object> map){
        log.info("recieved postmapping to /user: " + map.toString());
        User result = userService.registerUser(
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
    public ResponseEntity loginUser(@RequestBody HashMap<String, String> map){
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

    @DeleteMapping("user/{id}")
    public ResponseEntity deleteUser(@PathVariable Integer id){
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

    private int newActivityValidId(Activity activity) {
		log.info("creating new activity: " + activity.toString());
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

<<<<<<< HEAD
=======
    private int getRandomID() {
		log.info("creating new random id");
        Random rand = new Random();
        return rand.nextInt();
    }

>>>>>>> f03d22f (logging controller)
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
            list.add(Byte.parseByte(str, 2));
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
}
