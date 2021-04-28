package IDATT2106.team6.Gidd.web;

import static IDATT2106.team6.Gidd.Constants.*;
import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;
import static IDATT2106.team6.Gidd.web.ControllerUtil.getRandomID;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityEquipment;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.Equipment;
import IDATT2106.team6.Gidd.models.FriendGroup;
import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.FriendGroupService;
import IDATT2106.team6.Gidd.service.ImageService;
import IDATT2106.team6.Gidd.service.TagService;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.MapTokenRequired;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.naming.directory.InvalidAttributesException;
import org.eclipse.persistence.exceptions.JSONException;
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

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/activity")
public class ActivityController {
    private static Logger log = new Logger(ActivityController.class.toString());
    @Autowired
    private ActivityService activityService;
    @Autowired
    private EquipmentService equipmentService;
    @Autowired
    private UserService userService;
    @Autowired
    private TagService tagService;
    @Autowired
    private ImageService imageService;
    @Autowired
    private FriendGroupService groupService;

    @PostMapping(value = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity newActivity(@RequestBody Map<String, Object> map) {

        log.debug("Received new activity: " + map.toString());
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        headers.add("Content-Type", "application/json; charset=UTF-8");
        Activity newActivity;
        try {
            User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));

            if (user == null) {
                log.error("User is null, throwing exception");
                throw new InvalidAttributesException("User does not exist");
            }

            Image image = imageService.createImage(map.get("image").toString());
            if (image == null) {
                body.put("error", "the image is null");
                return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
            }

            newActivity = mapToActivity(map, -1, user, image);

            return createMultiple(user, newActivity, map, body, headers,
                                    Integer.parseInt(map.get("repeat").toString()));

        } catch (InvalidAttributesException e) {
            log.error("InvalidattributesException, " + e.getMessage());
            body.put("error", "invalid userID received");
            return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body(formatJson(body));
        } catch (IllegalArgumentException e){
            log.error("user is already registered to the activity");
            body.put("error", "user is already registered: " + e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
        } catch (Exception e) {
            body.put("error", "unknown error: " + e.getMessage());
            e.printStackTrace();
            log.error("unexplained error caught " + e + "; local:" + e.getLocalizedMessage());
            return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
        }
    }

    @PostMapping(value = "activityId}/equipment/{equipmentId}/user")
    public ResponseEntity registerUserToEquipment(@RequestBody HashMap<String, Object> map) {
        log.debug("Received PostMapping to '/activity/{activityId}/equipment/{equipmentId}/user'");
        int activityId = Integer.parseInt(map.get("activityId").toString());
        Activity activity = activityService.getActivity(activityId);

        log.debug("Finding activity with id " + activityId);
        if (activity == null) {
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
        if (equipment == null) {
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
        if (user == null) {
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
        for (ActivityEquipment ae : equipments) {
            if (ae.getEquipment().getEquipmentId() == equipmentId) {
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
                log.debug(
                        "Returning the id of activity: " + activityId + ", equipment: " + equipment +
                                ", user: " + userId);
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

    @MapTokenRequired
    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity editActivity(@RequestBody Map<String, Object> map,
                                       @PathVariable("id") int actId) {
        log.info("received putMapping to /activity/{id}");
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        log.debug("User with id received");
        Activity activity = activityService.getActivity(actId);


        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        headers.add("Content-Type", "application/json; charset=UTF-8");
        if (activity == null || user == null) {
            body.put("error", "user or activity is null");
            log.error("activity or user is null, returning error");
            log.debug("Activity: " + (activity == null));
            log.debug("User: " + (user == null));
            return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body(formatJson(body));
        }
        log.info("old activity " + activity.getActivityId());

        //edit points of participants
        ActivityLevel oldLevel = activity.getActivityLevel();
        ActivityLevel newLevel = ActivityLevel.valueOf(map.get("activityLevel").toString().toUpperCase());
        if (oldLevel != newLevel) {
            for (int i = 0; i < activity.getRegisteredParticipants().size(); i++) {
                User p = activity.getRegisteredParticipants().get(i).getUser();
                if (i != 0) {
                    p.setPoints(
                            (int) (p.getPoints() - JOIN_ACTIVITY_BONUS * MULTIPLIERS[oldLevel.ordinal()])
                                    +
                                    (int) (JOIN_ACTIVITY_BONUS * MULTIPLIERS[newLevel.ordinal()]));
                }
                else {
                    p.setPoints(
                            (int) (p.getPoints() - NEW_ACTIVITY_BONUS * MULTIPLIERS[oldLevel.ordinal()])
                                    +
                                    (int) (NEW_ACTIVITY_BONUS * MULTIPLIERS[newLevel.ordinal()]));
                }
                userService.editUser(p);
            }
        }

        Image newImage = activity.getImage();
        String[] imgInfo = imageService.splitBase(map.get("image").toString());
        newImage.setDatatype(imgInfo[0]);
        newImage.setBytes(Base64.getDecoder().decode(imgInfo[1]));
        imageService.editImage(newImage);

        activity.setTitle(map.get("title").toString());
        activity.setTime(Timestamp.valueOf(map.get("time").toString()));
        activity.setDescription(map.get("description").toString());
        activity.setCapacity(Integer.parseInt(map.get("capacity").toString()));
        activity.setActivityLevel(ActivityLevel.valueOf(map.get("activityLevel").toString()));
        activity.setLatitude(Double.parseDouble(map.get("latitude").toString()));
        activity.setLongitude(Double.parseDouble(map.get("longitude").toString()));
        activity.setImage(newImage);

        // equipment
        List<ActivityEquipment> oldEquips = activity.getEquipments();
        List<ActivityEquipment> newEquips = newEquipment(activity,map.get("equipmentList").toString());
        activity.setEquipments(newEquips);

        log.info("new activity: " + activity.getActivityId());
        boolean edited = activityService.editActivity(activity);
        if (!edited) {
            body.put("error", "activity was not edited");
            log.info("activity is not edited returning error");
            return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body("didnt work here either sad");
        }

        if(!removeEquipment(oldEquips, newEquips)){
            body.put("error", "could not remove old equipment");
            return ResponseEntity
                .status(500)
                .body(formatJson(body));
        }

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(activity.toString());
    }

    @GetMapping(value = "/{activityId}", produces = "application/json")
    public ResponseEntity getActivity(@PathVariable Integer activityId) throws JSONException {
        log.debug("Received GetMapping to '/activity/{activityId}' with activityId " + activityId);
        Activity activity = activityService.getActivity(activityId);

        if (activity == null) {
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

    @GetMapping(value = "")
    public ResponseEntity getActivities(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "searchWord", required = false) String searchValue,
            @RequestParam(value = "activityLevel", required = false) Integer activityLevel,
            @RequestParam(value = "tagDescription", required = false) String tagDescription)
            throws JSONException {
        log.debug("Received GetMapping to '/activity' with Query Params");
        List<Activity> activities;
        if (searchValue == null && activityLevel == null && tagDescription == null) {
            activities = activityService.getAllActivities();
        } else if (searchValue == null && tagDescription == null) {
            log.debug("Searching for activity level to activity");
            log.debug("Activity level is " + activityLevel);
            activities = activityService.filterByActivityLevel(activityLevel);
        } else if (tagDescription == null && activityLevel == null) {
            log.debug("Searching for title to activity");
            log.debug("Search word is " + searchValue);
            activities = activityService.searchForActivityByTitle(searchValue);
        } else {
            log.debug("Filtering activities with tag " + tagDescription);
            Tag tag = tagService.getTag(tagDescription);
            if (tag == null) {
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
            for (Object i : activityIds) {
                if (!(activityService.getActivity((Integer) i) == null)) {
                    activities.add(activityService.getActivity((Integer) i));
                }
            }
        }

        if (activities == null) {
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

        if(userId!=null) {
            User user = userService.getUser(userId);
            if (user != null){
                activities.addAll(groupService.getGroupActivitiesForUser(user));
            }
        }

        log.debug(String.format("There are %d activities", activities.size()));

        HttpHeaders header = new HttpHeaders();

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");
        log.debug(String.format("Returning %d activities", activities.size()));
        try{
            return ResponseEntity
                .ok()
                .headers(header)
                .body("{\"activities\": \n" + activities.toString() + "\n}");
        } catch (Exception e) {
            log.error("could not return cause of: " + e.getMessage() + " of cause: " + e.getCause() + " with message " + e.getCause().getMessage());
        }
        return ResponseEntity
                .badRequest()
                .headers(header)
                .body("{\"activities\": \n" + activities.toString() + "\n}");
    }

    @GetMapping(value = "/{id}/user", produces = "application/json")
    public ResponseEntity getAllUsersFromActivity(@PathVariable Integer id) {
        log.info("recieved get mapping /activity/" + id + "/user");
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> userMap = new HashMap<>();
        HashMap<String, String> errorCode = new HashMap<>();
        List<User> users = activityService.getUserFromActivity(id);
        if (!users.isEmpty()) {
            log.info("users found for activity with id " + id);
            userMap.put("user", "");

            users.stream()
                    .forEach(u -> userMap.put("user", userMap.get("user") + u.getUserId() + ","));
            //remove trailing comma
            userMap.put("user", userMap.get("user").substring(0, userMap.get("user").length() - 1));
            return ResponseEntity.ok().headers(headers).body("{\"user\":" + users.toString() + "}");
        }
        log.error("no activity was found with id: " + id);
        errorCode.put("error", "no activity found");
        return ResponseEntity.badRequest().headers(headers).body(formatJson(errorCode));
    }

    @DeleteMapping(value = "/{activityId}")
    public ResponseEntity deleteActivity(@PathVariable Integer activityId) {
        List<User> users = activityService.getUserFromActivity(activityId);
        Map<String, String> body = new HashMap<>();
        HttpHeaders header = new HttpHeaders();
        Activity activity = activityService.getActivity(activityId);
        if(activity == null){
            body.put("error", "the activity does not exist");
            return ResponseEntity.badRequest().headers(header).body(formatJson(body));
        }
        int bonusPoints = (int) (NEW_ACTIVITY_BONUS *
                MULTIPLIERS[activity.getActivityLevel().ordinal()]);
        if (activityService.deleteActivity(activityId)) {
            log.debug("The deletion was successful");
            header.add("Status", "200 OK");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("activityId", String.valueOf(activityId));

            imageService.removeImage(activity.getImage());
            String bodyJson = formatJson(body);

            //owner s included in getUserFromActivity() result
            users.forEach(u -> u.setPoints(u.getPoints() - bonusPoints));

            return ResponseEntity
                    .ok()
                    .headers(header)
                    .body(bodyJson.substring(0, bodyJson.length() - 1) + ",\"users\":" + users.toString() + "}");
        }

        body.put("error", "no activity was deleted, are you sure the activity exists");
        return ResponseEntity.badRequest().headers(header).body(formatJson(body));
    }

    private int newActivityValidId(Activity activity) {
        log.info("finding new valid id for an activity");
        boolean created;
        int endId;
        do {
            endId = getRandomID();
            log.debug("attempting id: " + endId);
            if (endId < 0) {
                endId = -endId;
            }
            activity.setActivityId(endId);
            created = activityService.addActivity(activity);
            log.debug("creating activity was " + created + " successful");
        }
        while (!created);
        log.info("final new activity id: " + endId);
        return endId;
    }

    private boolean registerEquipmentToActivity(int activityId, String equipment) {
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

        for (Equipment e : equipments) {
            log.debug("Adding [" + e.getEquipmentId() + ":" + e.getDescription() + "] to " +
                    activity.getActivityId());
            ActivityEquipment activityEquipment = new ActivityEquipment(activity, e);
            activity.addEquipment(activityEquipment);
        }
        if (!activityService.addEquipmentToActivity(activity)) {
            log.error("The registration failed");
            return false;
        }
        log.debug("The registration was successful");
        return true;
    }

    private void registerEquipment(String description) {
        log.debug("Registering " + description + " to equipment");
        equipmentService.registerEquipment(description.toLowerCase());
    }

    private Activity mapToActivity(Map<String, Object> map, int actId, User user, Image image)
        throws InvalidAttributesException {
        log.debug("map: to activity");
        String title = map.get("title").toString().trim();
        Timestamp newTime = Timestamp.valueOf(map.get("time").toString());
        int capacity = Integer.parseInt(map.get("capacity").toString());
        // group
        FriendGroup group = null;
        int groupId = Integer.parseInt(map.get("groupId").toString());
         if(groupId>=0){
             group = groupService.getFriendGroup(groupId);
             if(group==null){
                 throw new InvalidAttributesException("invalid groupId");
             }
             if(!group.getUsers().contains(user)){
                 throw new InvalidAttributesException("that user is not a part of the given group");
             }
         }
        String description = map.get("description").toString();
        // image
        ActivityLevel activityLevel =
            ActivityLevel.valueOf(map.get("activityLevel").toString().toUpperCase());
        List<Tag> tags = splitTags(map.get("tags").toString());
        double latitude = Double.parseDouble(map.get("latitude").toString());
        double longitude = Double.parseDouble(map.get("longitude").toString());

        return new Activity(actId,
            title, newTime, user,
            capacity, group, description, image,
            activityLevel, tags, latitude, longitude, null);
    }


    private List<Tag> splitTags(String tagString) {
        if(tagString.trim().equals("")){
            return Collections.emptyList();
        }
        log.info("splitting tags");
        ArrayList<String> tagNames = new ArrayList<>(Arrays.asList(tagString.split(",")));
        ArrayList<Tag> tags = new ArrayList<>();
        for (String name : tagNames) {
            name = name.toLowerCase();
            Tag tag = tagService.getTag(name);

            if (tag == null) {
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

    private List<ActivityEquipment> newEquipment (Activity activity, String equipList) {
        List<ActivityEquipment> oldEquips = activity.getEquipments();
        List<Equipment> equips = toEquipList(equipList);

        List<ActivityEquipment> res = new ArrayList<>();
        ActivityEquipment temp;
        boolean match;
        for (Equipment e : equips) {
            match = false;
            for (ActivityEquipment con: oldEquips) {
                if (con.getEquipment().getEquipmentId() == e.getEquipmentId()){
                    res.add(con);
                    match = true;
                    break;
                }
            }
            if(!match) {
                temp = new ActivityEquipment(activity, e);
                res.add(temp);
            }
        }
        log.info("final newEquipment list: " + res);
        return res;
    }

    private boolean removeEquipment (List<ActivityEquipment> oldEquips,
                                                     List<ActivityEquipment> newEquips) {
        List<ActivityEquipment> differences = new ArrayList<>(oldEquips);
        differences.removeAll(newEquips);

        try {
            boolean worked = true;
            for (ActivityEquipment activityEquipment: differences) {
                worked = activityService.removeEquipmentFromActivity(activityEquipment);
            }
            if(worked) {
                log.debug("All differences were removed successfully");
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("An exception occurred while removing equipment from activity");
            return false;
        }
    }

    private ResponseEntity createMultiple(User user, Activity activity, Map<String, Object> map,
                                                  HashMap<String,String> body, HttpHeaders headers,
                                                    int repeat) {
        List<Integer> res = new ArrayList();
        if(repeat>3) repeat = 3;
        do {
            Activity temp = new Activity(activity);
            int newId = newActivityValidId(temp);
            temp.setActivityId(newId);
            log.debug("new activity id: " + newId);

            if (!insertUserActivityCoupling(user, temp)) {
                body.put("error", "something went wrong when coupling the user and activity");
                return ResponseEntity
                    .badRequest()
                    .headers(headers)
                    .body(formatJson(body));
            }
            if (!registerEquipmentToActivity(newId, map.get("equipmentList").toString())) {
                log.error("Equipment could not be registered correctly");
                body.put("error", "could not add equipment, but continuing anyways");
            }

            log.info("Activity created successfully");
            res.add(temp.getActivityId());
            userService.setPoints(user,
                (int) (user.getPoints() +
                    NEW_ACTIVITY_BONUS * MULTIPLIERS[temp.getActivityLevel().ordinal()]));
        } while (repeat-- > 0);
        return ResponseEntity
            .ok()
            .body(res);
    }

    private List<Equipment> toEquipList(String equipString) {
        log.info("splitting equipment");
        ArrayList<Equipment> equips = new ArrayList<>();
        for (String name : equipString.split(",")) {
            name = name.toLowerCase();
            Equipment equipment = equipmentService.getEquipmentByDescription(name);
            if(equipment == null) {
                log.debug("equipment " + name + " did not exist, creating");
                equipment = new Equipment(name);
                equipmentService.addEquipment(equipment);
            }

            equips.add(equipment);
        }

        log.debug("final equip list: " + equips.toString());
        return equips;
    }

    boolean insertUserActivityCoupling(User user, Activity activity){
        //Legge inn sjekk om den allerede er registrert
        List<ActivityUser> activityUser = user.getActivities();
        ArrayList<Integer> activityIds = new ArrayList<>();
        Timestamp time = new Timestamp(new Date().getTime());

        for (ActivityUser as : activityUser) {
            activityIds.add(as.getActivity().getActivityId());
        }

        if (activityIds.contains(activity.getActivityId())) {
            throw new IllegalArgumentException("The user is already registered to the activity");
        }

        int couplingId = getRandomID();

        //Kalle insert-metode helt til den blir true

        ArrayList<ActivityUser> activityUsers = new ArrayList<>();
        ArrayList<Activity> activities = activityService.getAllActivities();
        for (Activity a : activities) {
            activityUsers.addAll(a.getRegisteredParticipants());
        }

        ArrayList<Integer> couplingIdList = new ArrayList<>();

        for (ActivityUser au : activityUsers) {
            couplingIdList.add(au.getId());
        }

        while (couplingIdList.contains(couplingId)) {
            couplingId = getRandomID();
        }

        if (userService.addUserToActivity(couplingId, activity, user, time)) {
            if (activityService.addUserToActivity(couplingId, activity, user, time)) {
                return true;
            }
            userService.removeActivity(couplingId, user);
            return false;
        }
        return false;
    }

}
