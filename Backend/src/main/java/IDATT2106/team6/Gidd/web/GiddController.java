package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.SecurityService;
import IDATT2106.team6.Gidd.service.TagService;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.MapTokenRequired;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
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
import java.util.stream.Collectors;
import javax.naming.directory.InvalidAttributesException;
import org.apache.commons.lang3.ArrayUtils;
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
import org.springframework.web.bind.annotation.ResponseBody;

//import org.json.JSONException;

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
    @MapTokenRequired
    public ResponseEntity home() {
        activityService.doNothing();
        return ResponseEntity
            .ok()
            .body("hi");
    }

    @ResponseBody
    @MapTokenRequired
    @GetMapping(value = "/tokenTestAOP")
    public Map<String, Object> tokenTestAOP(@RequestParam(value = "userid") String userid) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", "worked?!");
        return map;
    }

    @ResponseBody
    @RequestMapping("/security/generate/token")
    public Map<String, Object> generateToken(@RequestParam(value = "subject") String subject) {
        String token = securityService.createToken(subject, (2 * 1000 * 60));
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", token);
        //TODO Return JSON
        return map;
    }

    @ResponseBody
    @RequestMapping("/security/get/subject")
    public Map<String, Object> getSubject(@RequestParam(value = "token") String token) {
        String subject = securityService.getSubject(token);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", subject);
        return map;
    }

    @ResponseBody
    @GetMapping("/hello2")
    @MapTokenRequired
    public Map<String, Object> testAOPAnnotation() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("result", "Aloha");
        return map;
    }

    @PostMapping("/user")
    public ResponseEntity registerUser(@RequestBody HashMap<String, Object> map) {
        //      TODO Error handling
        //      Return Exception to user
        log.info("recieved postmapping to /user: " + map.toString());
        Map<String, String> body = new HashMap<>();

        if (userService.getUser(map.get("email").toString()) != null) {
            body.put("error", "a user with that email already exists!");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }

        User result = userService.registerUser(
            getRandomID(),
            map.get("email").toString(),
            map.get("password").toString(),
            map.get("firstName").toString(),
            map.get("surname").toString(),
            Integer.parseInt(map.get("phoneNumber").toString()),
            ActivityLevel.valueOf(map.get("activityLevel").toString()),
            Provider.LOCAL);
        log.info("created user with id: " + result.getUserId());
        HttpHeaders header = new HttpHeaders();

        header.add("Content-Type", "application/json; charset=UTF-8");
        log.info("created user " + result.getUserId() + " | " + result.getEmail());
        if (result != null) {
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
    public ResponseEntity loginSome(@RequestBody Map<String, Object> map) {
        Map<String, String> body = new HashMap<>();

        try {
            log.info("received postmapping to /login" + map.toString());
            log.error("provider recieved: " + map.get("provider").toString());
            Provider provider = Provider.valueOf(map.get("provider").toString());
            if (provider == Provider.LOCAL) {
                return loginUser(map);
            }

            URL url;

            if (provider == Provider.FACEBOOK) {
                log.info("logging in with FACEBOOK");
                url = new URL("https://graph.facebook.com/debug_token?input_token=" +
                    map.get("accessToken").toString() +
                    "&access_token=124734739639594|mI_etwHdsRvB6s3fVf62yZQldYQ");
            } else if (provider == Provider.GOOGLE) {
                log.info("logging in with GOOGLE");
                url = new URL(
                    "https://oauth2.googleapis.com/tokeninfo?id_token=" + map.get("accessToken"));
            } else {
                body.put("error", "invalid provider provided");

                return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
            }

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setConnectTimeout(5000);
            con.setReadTimeout(5000);

            int status = con.getResponseCode();
            BufferedReader in;
            if (status > 299) {
                in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            } else {
                in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            }

            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();

            Map resMap;
            if (provider == Provider.FACEBOOK) {
                resMap =
                    new ObjectMapper()
                        .readValue(content.substring(8, content.length() - 1), Map.class);
                if (Boolean.parseBoolean(resMap.get("is_valid").toString())) {
                    log.info("access token valid");
                    return someCheckUser(map, body, provider);

                } else {
                    body.put("error", "invalid access token");
                    return ResponseEntity
                        .badRequest()
                        .body(formatJson(body));
                }
            }
            // Provider must be GOOGLE if not FACEBOOK or LOCAL. Add if,
            // if more SoMe logins are added
            else {
                // TODO GOOGLE
                resMap = new ObjectMapper().readValue(content.toString(), Map.class);
                if (resMap.containsKey("error")) {
                    body.put("error", "invalid access token");

                    return ResponseEntity
                        .badRequest()
                        .body(formatJson(body));
                }

                return someCheckUser(map, body, provider);
            }
        } catch (NullPointerException e) {
            body.put("error", "missing parameter");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        } catch (Exception e) {
            log.error("An unexpected error was caught while logging in");

            body.put("error", "something went wrong");
            return ResponseEntity
                .unprocessableEntity()
                .body(formatJson(body));
        }
    }

    @PostMapping("/login/old")
    public ResponseEntity loginUser(@RequestBody Map<String, Object> map) {
        log.info("recieved postmapping to /login " + map.toString());
        HttpHeaders header = new HttpHeaders();
        boolean result =
            userService.login(map.get("email").toString(), map.get("password").toString());
        Map<String, String> body = new HashMap<>();
        if (result) {
            log.info("logged in user with email " + map.get("email").toString());
            body.put("id",
                String.valueOf(userService.getUser(map.get("email").toString()).getUserId()));
            header.add("Status", "200 OK");
            return ResponseEntity.ok()
                .headers(header)
                .body(formatJson(body));
        }
        log.error("unable to login user with email: " + map.get("email").toString());
        header.add("Status", "403 Forbidden");
        body.put("error", "unable to login user with email: " + map.get("email").toString());
        return ResponseEntity.status(403)
            .headers(header).body(formatJson(body));
    }

    @PostMapping(value = "/activity", consumes = "application/json", produces = "application/json")
    public ResponseEntity newActivity(@RequestBody Map<String, Object> map) {

        log.debug("Received new activity: " + map.toString());
        int newId;
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        headers.add("Content-Type", "application/json; charset=UTF-8");
        Activity newActivity = null;
        try {
            User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
            if (user == null) {
                log.error("User is null, throwing exception");
                throw new InvalidAttributesException("User does not exist");
            }
            newId = 0;

            newActivity = mapToActivity(map, newId, user);
            log.debug("Created new activity: " + newActivity.getActivityId());
            newId = newActivityValidId(newActivity);
            log.debug("new activity id: " + newId);

            if(!insertUserActivityCoupling(user, newActivity)){
                body.put("error", "something went wrong when coupling the user and activiyt");
                return ResponseEntity
                        .badRequest()
                        .headers(headers)
                        .body(formatJson(body));
            }
            registerEquipmentToActivity(newId, map.get("equipmentList").toString());

            log.info("Activity created successfully");

            body.put("id", "" + newActivity.getActivityId());
            return ResponseEntity
                    .created(URI.create(String.format("/activity/%d", newActivity.getActivityId())))
                    .body(formatJson(body));

        } catch (InvalidAttributesException e) {
            log.error("InvalidattributesException, invalid userID recieved " + e.getMessage());
            body.put("error", e.getMessage());
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
            log.error("unexplained error caught " + e + "; local:" + e.getLocalizedMessage());
            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }
    }

    @PostMapping(value = "/activity/{activityId}/equipment/{equipmentId}/user")
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

    @PostMapping(value = "/user/activity", consumes = "application/json", produces = "application/json")
    public ResponseEntity registerUserToActivity(@RequestBody HashMap<String, Object> map) {
        log.debug("Received PostMapping to '/user/{userId}/activity with userId" +
            Integer.parseInt(map.get("userId").toString()) + " and activityId " +
            Integer.parseInt(map.get("activityId").toString()));

        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        Activity activity =
            activityService.findActivity(Integer.parseInt(map.get("activityId").toString()));

        HttpHeaders header = new HttpHeaders();
        Map<String, String> body = new HashMap<>();

        if (user == null) {
            log.error("User is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The user does not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        if (activity == null) {
            log.error("Activity is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");


            body.put("error", "The activity does not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        try {
            if (insertUserActivityCoupling(user, activity)) {
                log.debug("The registration was successful");
                header.add("Status", "200 OK");
                header.add("Content-Type", "application/json; charset=UTF-8");

                body.put("userId", String.valueOf(user.getUserId()));
                body.put("activityId", String.valueOf(activity.getActivityId()));

                return ResponseEntity
                        .ok()
                        .headers(header)
                        .body(formatJson(body));
            } else {
                log.error("Something wrong happened when trying to register the activity to the user");
                header.add("Status", "400 BAD REQUEST");
                header.add("Content-Type", "application/json; charset=UTF-8");


                body.put("error", "Something wrong happened registering the coupling between user and activity");
                return ResponseEntity
                        .badRequest()
                        .headers(header)
                        .body(formatJson(body));

            }
        } catch(IllegalArgumentException e){
            log.error("user is already registered to the activity");
            body.put("error", "user is already registered to the activity: " + e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }
    }

    @PostMapping(value = "/user/{userId}/user")
    public ResponseEntity addFriend(@RequestBody HashMap<String, Object> map) {
        log.debug("Adding friend with userId " + map.get("friendId").toString() + " to " +
            map.get("userId").toString());
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        User friend = userService.getUser(Integer.parseInt(map.get("friendId").toString()));

        if (friend == null || user == null) {
            log.error("One of the users are null");
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "One of the users do not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        ArrayList<Integer> friendIds = new ArrayList<>();
        for (User u : user.getFriendList()) {
            friendIds.add(u.getUserId());
        }

        if (friendIds.contains(friend.getUserId())) {
            log.error("There are already a connection between the users");
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The users are already friends");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        if (!userService.updateUser(user, friend)) {
            log.error("Something wrong happened when trying to update");
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "Something wrong happened when trying to update");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        HttpHeaders header = new HttpHeaders();
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        Map<String, String> body = new HashMap<>();

        body.put("userId", String.valueOf(user.getUserId()));
        body.put("friendId", String.valueOf(friend.getUserId()));

        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }

    @PutMapping(value = "/user/{id}")
    public ResponseEntity editUser(@RequestBody Map<String, Object> map, @PathVariable Integer id) {
        log.info("recieved a put mapping for user with id: " + id + " and map " + map.toString());
        Map<String, String> body = new HashMap<>();
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "application/json; charset=UTF-8");

        try {
            if (!userService.login(map.get("email").toString(), map.get("password").toString())) {
                log.debug("Someone tried to edit a user with an invalid email or password ");
                body.put("error", "Invalid Email or Password");
                return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
            }
        } catch (NullPointerException e) {
            log.error("A NullPointerException was caught while editing user");
            body.put("error", "Invalid Email or Password");
            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        if (map.get("newPassword") == null || map.get("newPassword").equals("")) {
            map.put("newPassword", map.get("password"));
        }

        if (!validateStringMap(map)) {
            log.error(
                "returning error about null/blank fields in user put mapping " + map.toString());
            body.put("error", "one or more json-fields is null/blank");
            return ResponseEntity.badRequest().body(formatJson(body));
        }

        try {
            Integer.parseInt(map.get("phoneNumber").toString());
        } catch (NumberFormatException e) {
            log.error("phone number cannot be parsed to number " + map.toString());
            body.put("error", "phone number is not numeric");
            return ResponseEntity.badRequest().body(formatJson(body));
        } catch (Exception e) {
            log.error("An unexpected message was caught when parsing phoneNumber: " +
                e.getMessage() + " local: " + e.getLocalizedMessage());
            body.put("Error", "Something went wrong");
            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }

        try {
            boolean result = userService.editUser(
                id,
                map.get("newEmail").toString(),
                map.get("newPassword").toString(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                Integer.parseInt(map.get("phoneNumber").toString()),
                ActivityLevel.valueOf(map.get("activityLevel").toString()));

            log.info("edited user " + map.toString());
            if (result) {
                log.info("created user");
                header.add("Status", "201 CREATED");

                body.put("id", String.valueOf(id));

                return ResponseEntity.ok()
                    .headers(header)
                    .body(formatJson(body));
            }
        } catch (NullPointerException e) {
            log.debug("A NullPointerException was caught while attempting to edit user");
            body.put("error", "invalid input");
            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        } catch (Exception e) {
            log.debug("An error was caught while attempting to edit user: " +
                e.getMessage() + " | Local: " + e.getLocalizedMessage());
            body.put("error", "Something went wrong");
            return ResponseEntity.badRequest().body(formatJson(body));
        }

        log.error("User could not be edited, are you sure the user exists");
        header.add("Status", "400 BAD REQUEST");
        body.put("error", "could not edit user are you sure the user exists?");
        return ResponseEntity
            .badRequest()
            .body(formatJson(body));
    }

    // TODO This method NEEDS to control token once that's possible
    @PutMapping(value = "/user/{id}/setsome")
    public ResponseEntity editSomeUser(@RequestBody Map<String, Object> map,
                                       @PathVariable Integer id) {
        Map<String, String> body = new HashMap<>();

        if(!parsePhone(map, body)) {
            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }

        try{
            boolean result = userService.editUser(
                id,
                map.get("email").toString(),
                map.get("newPassword").toString(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                Integer.parseInt(map.get("phoneNumber").toString()),
                ActivityLevel.valueOf(map.get("activityLevel").toString())
            );

            if (result) {
                log.info("created user");
                body.put("userId", String.valueOf(id));

                return ResponseEntity
                    .ok()
                    .body(formatJson(body));
            }
        } catch (NullPointerException npe) {
            body.put("error", "invalid parameter");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        } catch (Exception e) {
            log.error("An unexpected error was caught while editing user: " + e.getMessage());
            body.put("error", "an unexpected error occurred");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }
        log.error("Could not edit user for some unexpected reason");
        body.put("error", "user could not be edited");

        return ResponseEntity
            .badRequest()
            .body(formatJson(body));
    }

    @PutMapping(value = "/activity/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity editActivity(@RequestBody Map<String, Object> map,
                                       @PathVariable("id") int actId) {
        log.info("recieved putmapping to /activity/{id}");
        User user = userService.getUser(Integer.parseInt(map.get("userId").toString()));
        log.debug("User with id recieved");
        Activity activity = activityService.getActivity(actId);
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        log.info("old activity " + activity.getActivityId());
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

        activity.setTitle(map.get("title").toString());
        activity.setTime(Timestamp.valueOf(map.get("time").toString()));
        activity.setDescription(map.get("description").toString());
        activity.setCapacity(Integer.parseInt(map.get("capacity").toString()));
        activity.setActivityLevel(ActivityLevel.valueOf(map.get("activityLevel").toString()));
        activity.setLatitude(Double.parseDouble(map.get("latitude").toString()));
        activity.setLongitude(Double.parseDouble(map.get("longitude").toString()));
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

        return ResponseEntity
            .ok()
            .headers(headers).body(formatJson(body));
    }

    @GetMapping(value = "/user", produces = "application/json")
    public ResponseEntity getAllUsers() {
        log.debug("Received GetMapping at '/user'");
        try {
            List<User> users = userService.getUsers();
            return ResponseEntity
                .ok()
                .body(users.toString());
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

    @GetMapping(value = "/tag", produces = "application/json")
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

    @GetMapping(value = "/activity/{activityId}", produces = "application/json")
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

    @GetMapping(value = "/activity")
    public ResponseEntity getActivities(
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
    public ResponseEntity getAllUsersFromActivity(@PathVariable Integer id) {
        log.info("recieved get mapping /activity/" + id + "/user");
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> userMap = new HashMap<>();
        HashMap<String, String> errorCode = new HashMap<>();
        List<User> users = activityService.getUserFromActivity(id);
        if (users.size() != 0) {
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

    @GetMapping(value = "/user/{userId}", produces = "application/json")
    public ResponseEntity getSingleUser(@PathVariable Integer userId) {
        log.debug("recieved single user get " + userId);
        User user = userService.getUser(userId);
        HttpHeaders header = new HttpHeaders();
        if (user != null) {
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

    @GetMapping(value = "/user/email/{email}", produces = "application/json")
    public ResponseEntity getUser(@PathVariable String email) {
        log.debug("get mapping for email: " + email);
        HttpHeaders header = new HttpHeaders();

        User user = userService.getUser(email);
        if (user != null) {
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
    public ResponseEntity getAllActivitiesForUser(@PathVariable Integer userId) {
        log.debug("Received GetMapping to '/user/{userId}/activity' with userId " + userId);
        User user = userService.getUser(userId);

        HttpHeaders header = new HttpHeaders();

        if (user == null) {
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

        StringBuilder sb = new StringBuilder();

        List<Activity> activities =
            activityUser.stream().map(ActivityUser::getActivity).collect(Collectors.toList());

        return ResponseEntity
            .ok()
            .headers(header)
            .body("{\"activities\":" + activities.toString() + "}");
    }

    @GetMapping(value = "/user/{userId}/user")
    public ResponseEntity getFriends(@PathVariable Integer userId) {
        log.debug("Received GetMapping to '/user/{userId}/user'");
        User user = userService.getUser(userId);

        if (user == null) {
            HttpHeaders header = new HttpHeaders();
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

        ArrayList<User> friends = new ArrayList<>();
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("{\"users\":[");

        for (User u : user.getFriendList()) {
            if (u.getFriendList().contains(user)) {
                friends.add(u);
                stringBuilder.append(u.toJSON());
                stringBuilder.append(",");
            }
        }

        stringBuilder.replace(stringBuilder.length() - 1, stringBuilder.length(), "");
        stringBuilder.append("]}");

        HttpHeaders header = new HttpHeaders();
        log.debug("Returning friends");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
            .ok()
            .headers(header)
            .body(stringBuilder.toString());
    }

    @GetMapping("/user/{userId}/user/{friendId}")
    public ResponseEntity checkFriendship(@PathVariable Integer userId, @PathVariable Integer friendId) {
        log.debug("Received GetMapping to '/user/{userId}/user/{friendId}'");
        User user = userService.getUser(userId);
        User friend = userService.getUser(friendId);

        if (user == null || friend == null) {
            HttpHeaders header = new HttpHeaders();
            log.error("The user or the friend is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The user or the friend does not exist");
            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        Friendship friendship = userService.checkFriendship(user, friend);

        HttpHeaders header = new HttpHeaders();
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        log.debug("Friendship is " + friendship);
        HashMap<String, String> body = new HashMap<>();
        body.put("friendship", friendship.toString());

        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @DeleteMapping(value = "/user/{userId}/activity/{activityId}", produces = "application/json")
    public ResponseEntity deleteActivityToUser(@PathVariable Integer userId,
                                               @PathVariable Integer activityId) {
        log.debug(
            "Received DeleteMapping to /user/{userId}/activity/{activityId} with userId being " +
                userId + " and activityId being " + activityId);
        User user = userService.getUser(userId);
        Activity activity = activityService.findActivity(activityId);

        HttpHeaders header = new HttpHeaders();
        if (user == null) {
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

        if (activity == null) {
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

        for (ActivityUser au : activityUsers) {
            activitiesIds.add(au.getActivity().getActivityId());
        }

        if (!activitiesIds.contains(activityId)) {
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
        if (activityUser == null) {
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
        if (!userService.deleteConnection(activityUser) ||
            !userService.removeActivity(activityUserId, user) ||
            !activityService.removeUserFromActivity(activityUserId, activity)) {
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
    public ResponseEntity deleteUser(@PathVariable Integer id) {
        //todo return activity-objects and user id's affected by this user being deleted 
        // aka the activities this user has created
        log.info("recieved deletemapping to user with id " + id);
        HttpHeaders header = new HttpHeaders();
        boolean result = userService.deleteUser(id);
        Map<String, String> body = new HashMap<>();

        if (result) {
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
    public ResponseEntity deleteActivity(@PathVariable Integer activityId) {
        List<User> users = activityService.getUserFromActivity(activityId);
        Map<String, String> body = new HashMap<>();
        HttpHeaders header = new HttpHeaders();
        if (activityService.deleteActivity(activityId)) {
            log.debug("The deletion was successful");
            header.add("Status", "200 OK");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("activityId", String.valueOf(activityId));

            String bodyJson = formatJson(body);
            return ResponseEntity
                .ok()
                .headers(header)
                .body(bodyJson.substring(0, bodyJson.length() - 1) + ",\"users\":" + users.toString() + "}");
        }

        body.put("error", "no activity was deleted, are you sure the activity exists");
        return ResponseEntity.badRequest().headers(header).body(formatJson(body));
    }

    @DeleteMapping(value = "/user/{userId}/user/{friendId}")
    public ResponseEntity deleteFriend(@PathVariable Integer userId,
                                       @PathVariable Integer friendId) {
        log.debug("Received DeleteMapping to '/user/{userId}/user/{friendId}");
        User user = userService.getUser(userId);
        User friend = userService.getUser(friendId);

        if (friend == null || user == null) {
            log.error("One of the users are null");
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "One of the users do not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        if (!userService.deleteFriendship(user, friend)) {
            log.error("The deleting went wrong");
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            Map<String, String> body = new HashMap<>();

            body.put("error", "The deleting went wrong");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        log.debug("The friendship was deleted");
        HttpHeaders header = new HttpHeaders();
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        Map<String, String> body = new HashMap<>();

        body.put("userId", String.valueOf(user.getUserId()));
        body.put("friendId", String.valueOf(friend.getUserId()));

        return ResponseEntity
            .badRequest()
            .headers(header)
            .body(formatJson(body));
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
            log.debug("creating activity was " + created + " successfull");
        }
        while (!created);
        log.info("final new activity id: " + endId);
        return endId;
    }

    private int getRandomID() {
        log.info("creating new random id");
        int id = new Random().nextInt();
        return (id > 0 ? id : -id);
    }


    private ResponseEntity someCheckUser(Map<String, Object> map,
                                         Map<String, String> body,
                                         Provider provider) throws URISyntaxException {
        User user = userService.getUser(map.get("email").toString());
        if (user != null) {
            log.info("email already found in database, generating JWT");
            body.put("token", securityService
                .createToken(String.valueOf(user.getUserId()), (1000 * 60 * 5)));
            body.put("userId", String.valueOf(user.getUserId()));

            return ResponseEntity
                .ok()
                .body(formatJson(body));
        }

        log.info("email doesn't exist in database, attempting to create user");
        User newUser = userService.registerUser(
            getRandomID(),
            map.get("email").toString(),
            "9djw#ekc<_>a8ZS" + getRandomID(),
            map.get("firstName").toString(),
            map.get("surname").toString(),
            -1,
            null,
            provider);

        // TODO this segment can be removed once registerUser()
        //  makes sure the user gets a valid id
        if (newUser == null) {
            throw new NullPointerException();
        }

        body.put("token", securityService
            .createToken(String.valueOf(newUser.getUserId()), (1000 * 60 * 5)));
        body.put("userId", String.valueOf(newUser.getUserId()));

        return ResponseEntity
            .created((new URI("/user/" + newUser.getUserId())))
            .body(formatJson(body));
    }

    private List<Tag> splitTags(String tagString) {
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

    private byte[] binaryToByte(String bin) {
        log.debug("binary to byte array");
        List<Byte> list = new ArrayList<>();

        for (String str : bin.split("(?<=\\G.{8})")) {
            list.add((byte) Integer.parseInt(str, 2));
        }

        Byte[] bytes = list.toArray(new Byte[list.size()]);
        return ArrayUtils.toPrimitive(bytes);
    }

    private String formatJson(Map values) {
        log.debug("formatting json");
        String result = "{";
        Iterator it = values.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            String goose = "";

            //todo very scuffed
            try {
                Integer.parseInt(pair.getValue().toString());
            } catch (Exception e) {
                goose = "\"";
            }

            result += "\"" + pair.getKey() + "\":" + goose + pair.getValue() + goose + ",\n";
            it.remove(); // avoids a ConcurrentModificationException
        }
        //remove trailing comma
        return result.substring(0, result.length() - (result.length() > 1 ? 2 : 0)) + "}";
    }

    private Activity mapToActivity(Map<String, Object> map, int actId, User user) {
        log.debug("map: " + map.toString() + " to activity");
        String title = map.get("title").toString().trim();
        Timestamp newTime = Timestamp.valueOf(map.get("time").toString());
        int repeat = Integer.parseInt(map.get("repeat").toString());
        int capacity = Integer.parseInt(map.get("capacity").toString());
        int groupId = Integer.parseInt(map.get("groupId").toString());
        String description = map.get("description").toString();
        byte[] image = binaryToByte(map.get("image").toString());
        ActivityLevel activityLevel =
            ActivityLevel.valueOf(map.get("activityLevel").toString().toUpperCase());
        List<Tag> tags = splitTags(map.get("tags").toString());
        double latitude = Double.parseDouble(map.get("latitude").toString());
        double longitude = Double.parseDouble(map.get("longitude").toString());

        return new Activity(actId,
            title, newTime, repeat, user,
            capacity, groupId, description, image,
            activityLevel, tags, latitude, longitude, null);
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

    private boolean validateStringMap(Map<String, Object> map) {
        log.info("validating map values of " + map.toString());
        for (Map.Entry<String, Object> stringObjectEntry : map.entrySet()) {
            try {
                Map.Entry<String, Object> pair = (Map.Entry) stringObjectEntry;
                log.debug("Validating pair: " + pair.getKey() + ":" + pair.getValue());
                if (String.valueOf(pair.getValue()).isBlank() || pair.getValue() == null) {
                    log.error(pair.getKey() + " : " + pair.getValue() + " could not be validated");
                    return false;
                }
            } catch (Exception e) {
                log.error("An exception was caught while validating string map: " +
                    e.getMessage() + "local: " + e.getLocalizedMessage());
            }
        }
        log.info("map: " + map.toString() + " validated");
        return true;
    }

    private boolean insertUserActivityCoupling(User user, Activity activity){
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

        log.debug("Generating random id...");
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

    private boolean parsePhone(Map<String, Object> map, Map<String, String> body) {
        try {
            Integer.parseInt(map.get("phoneNumber").toString());
        } catch (NumberFormatException e) {
            log.error("phone number cannot be parsed to number " + map.toString());
            body.put("error", "phone number is not numeric");
            return false;
        } catch (Exception e) {
            log.error("An unexpected message was caught when parsing phoneNumber: " +
                e.getMessage() + " local: " + e.getLocalizedMessage());
            body.put("Error", "Something went wrong");
            return false;
        }
        return true;
    }
}
