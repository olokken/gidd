package IDATT2106.team6.Gidd.web;

import static IDATT2106.team6.Gidd.Constants.*;
import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;
import static IDATT2106.team6.Gidd.web.ControllerUtil.getRandomID;
import static IDATT2106.team6.Gidd.web.ControllerUtil.parsePhone;
import static IDATT2106.team6.Gidd.web.ControllerUtil.validateStringMap;

import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.service.ActivityService;
import IDATT2106.team6.Gidd.service.FriendGroupService;
import IDATT2106.team6.Gidd.service.ImageService;
import IDATT2106.team6.Gidd.service.RatingService;
import IDATT2106.team6.Gidd.service.SecurityService;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.MapTokenRequired;
import IDATT2106.team6.Gidd.util.PathTokenRequired;
import IDATT2106.team6.Gidd.util.PathTwoTokenRequired;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/user")
public class UserController {
    private static Logger log = new Logger(UserController.class.toString());
    @Autowired
    private ActivityService activityService;
    @Autowired
    private UserService userService;
    @Autowired
    private FriendGroupService friendGroupService;
    @Autowired
    private SecurityService securityService;
    @Autowired
    private RatingService ratingService;
    @Autowired
    private ImageService imageService;

    @GetMapping(value = "", produces = "application/json")
    public ResponseEntity getAllUsers() {
        log.debug("Received GetMapping at '/user'");
        try {
            List<User> users = userService.getUsers();
            return ResponseEntity
                .ok()
                .body(users.toString());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("An unexpected error was caught while getting all tags: " +
                e.getCause() + " with message " + e.getMessage());
            HashMap<String, String> body = new HashMap<>();
            body.put("error", "something went wrong");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }
    }

    /**
     * deletes the friendmapping from userId to friendId
     */
    @PathTokenRequired
    @DeleteMapping(value = "/{userId}/user/{friendId}")
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
        userService.setPoints(user, (int) (user.getPoints() - ADD_FRIEND_BONUS));
        userService.setPoints(friend, friend.getPoints() - ADD_FRIEND_BONUS);

        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }

    @PathTokenRequired
    @DeleteMapping("/{id}")
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

    /**
     * removes a user form being signed up for an activity
     * @param userId
     * @param activityId
     * @return
     */
    @PathTokenRequired
    @DeleteMapping(value = "/{userId}/activity/{activityId}", produces = "application/json")
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
        Map<String, String> body = new HashMap<>();

        int activityUserId = userService.getActivityUser(activity, user);

        ActivityUser activityUser = userService.getActivityUserById(activityUserId);
        if (activityUser == null) {
            log.error("There is no connection between user and activity");
            header.add("Status", "400 REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");


            body.put("error", "The user is not registered to the activity");
            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }
        //if the user being deleted is the owner
        if (activity.getUser().getUserId() == user.getUserId()) {
            body.put("error", "cannot delete owner from own activity");

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


            body.put("error", "Something went wrong when trying to delete");
            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        log.debug("The deletion was successful");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");
        body.put("userId", String.valueOf(user.getUserId()));
        body.put("activityId", String.valueOf(activity.getActivityId()));

        user.setPoints(
            user.getPoints() - HOST_JOIN_BONUS
        );
        userService.setPoints(user, (int) (user.getPoints() -
            JOIN_ACTIVITY_BONUS * MULTIPLIERS[activity.getActivityLevel().ordinal()]));
        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }

    /**
     * deletes message notification that the user has received
     * @param userId
     * @param activityId
     * @return
     */
    @DeleteMapping("/{userId}/notification/{activityId}")
    public ResponseEntity deleteNotification(@PathVariable Integer userId,
                                             @PathVariable Integer activityId) {
        HttpHeaders headers = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        User user = userService.getUser(userId);
        Activity activity = activityService.getActivity(activityId);
        if (user != null && activity != null) {
            if (userService.removeNotification(user, activity)) {
                return ResponseEntity
                    .ok()
                    .headers(headers)
                    .build();
            }
            body.put("error", "could not delete");
            return ResponseEntity
                .badRequest()
                .headers(headers)
                .body(formatJson(body));
        }

        body.put("error", "user or activity do not exist");
        return ResponseEntity.badRequest()
            .headers(headers)
            .body(formatJson(body));
    }

    /**
     * checks whether two users are friends and returns an enum
     * @param userId
     * @param friendId
     * @return
     *     SENT,
     *     FRIENDS,
     *     RECEIVED,
     *     NOTHING
     */
    @GetMapping("/{userId}/user/{friendId}")
    public ResponseEntity checkFriendship(@PathVariable Integer userId,
                                          @PathVariable Integer friendId) {
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

    /**
     * gets all the friends of a given user
     * @param userId
     * @return
     */
    @PathTokenRequired
    @GetMapping(value = "/{userId}/user")
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

        boolean remove = false;
        for (User u : user.getFriendList()) {
            if (u.getFriendList().contains(user)) {
                friends.add(u);
                stringBuilder.append(u.toJSON());
                stringBuilder.append(",");
                remove = true;
            }
        }

        if (remove) {
            stringBuilder.replace(stringBuilder.length() - 1, stringBuilder.length(), "");
        }
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

    /**
     * get all friend requests that a given user has recieved
     * @param userId
     * @return
     */
    @PathTokenRequired
    @GetMapping("/{userId}/request")
    public ResponseEntity getAllFriendRequests(@PathVariable Integer userId) {
        log.debug("Received GetMapping to 'user/{userId}/request' with userId " + userId);
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

        log.debug("Returning all users that has sent a request");
        ArrayList<User> requests = userService.getReceivedRequests(user);

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
            .ok()
            .headers(header)
            .body("{\"users\" :" + requests.toString() + "}");
    }

    /**
     * get all friend requests that a given user has sent
     * @param userId
     * @return
     */
    @PathTokenRequired
    @GetMapping("/{userId}/pending")
    public ResponseEntity getAllPendingRequests(@PathVariable Integer userId) {
        log.debug("Received GetMapping to 'user/{userId}/pending'");
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

        ArrayList<User> sentRequests = userService.getSentRequests(user);

        log.debug("Returning all user the user has sent a request to");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
            .ok()
            .headers(header)
            .body("{\"users\" :" + sentRequests.toString() + "}");
    }

    @PathTokenRequired
    @GetMapping(value = "/{userId}/activity", produces = "application/json")
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

        log.debug("Getting all activities " + user.getUserId() + " is registered to");
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

    @GetMapping(value = "/email/{email}", produces = "application/json")
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

    @GetMapping(value = "/{userId}", produces = "application/json")
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

    @PathTokenRequired
    @GetMapping("/{userId}/group")
    public ResponseEntity getGroupsForUser(@PathVariable Integer userId) {
        log.debug("Received GetMapping to '/user/{userId}/group'");
        User user = userService.getUser(userId);

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        if (user == null) {
            log.error("The user is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The user does not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        List<FriendGroup> allFriendGroups = friendGroupService.getAllFriendGroups();
        ArrayList<FriendGroup> friendGroups = userService.getFriendGroups(userId, allFriendGroups);

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
            .ok()
            .headers(header)
            .body("{ \"groups\" : " + friendGroups.toString() + "}");
    }

    /**
     * get the average rating of a given user
     * @param userId
     * @return
     */
    @GetMapping("/{userId}/rating")
    public ResponseEntity getRating(@PathVariable Integer userId) {
        log.debug("Received GetMapping to '/user/{userId}/rating'");
        User user = userService.getUser(userId);

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        if (user == null) {
            log.error("The user is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The user does not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        double averageRating = ratingService.getRating(user);

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        body.put("averageRating", String.valueOf(averageRating));

        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }


    @PathTwoTokenRequired
    @PutMapping(value = "/some/{id}")
    public ResponseEntity editSomeUser(@RequestBody Map<String, Object> map,
                                       @PathVariable Integer id) {
        log.debug("Received request at /user/some/" + id);
        Map<String, String> body = new HashMap<>();
        HttpHeaders headers = new HttpHeaders();

        if (!parsePhone(map, body)) {
            log.error("Could not parse phoneNumber");

            return ResponseEntity
                .badRequest()
                .headers(headers)
                .body(formatJson(body));
        }

        try {
            log.debug("Attempting to edit user");
            User user = userService.getUser(id);
            log.debug("Found user " + user.getUserId());

            Image newImage = user.getImage();
            String[] imgInfo = imageService.splitBase(map.get("image").toString());
            newImage.setDatatype(imgInfo[0]);
            newImage.setBytes(Base64.getDecoder().decode(imgInfo[1]));
            imageService.editImage(newImage);

            boolean result = userService.editUser(
                id,
                map.get("email").toString(),
                map.get("newPassword").toString(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                Integer.parseInt(map.get("phoneNumber").toString()),
                ActivityLevel.valueOf(map.get("activityLevel").toString()),
                newImage,
                user.getAuthProvider()
            );

            if (result) {
                log.info("created user");
                body.put("userId", String.valueOf(id));

                return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(formatJson(body));
            }
        } catch (NullPointerException npe) {
            log.error("a nullpointerexception was caught");
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
            .headers(headers)
            .body(formatJson(body));
    }

    @PathTwoTokenRequired
    @PutMapping(value = "/{id}")
    public ResponseEntity editUser(@RequestBody Map<String, Object> map, @PathVariable Integer id) {
        log.info("receieved a put mapping for user with id: " + id);
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

        if (map.get("newEmail") == null || map.get("newEmail").equals("")) {
            map.put("newEmail", map.get("email"));
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
            User oldUser = userService.getUser(id);

            Image newImage = oldUser.getImage();
            String[] imgInfo = imageService.splitBase(map.get("image").toString());
            newImage.setDatatype(imgInfo[0]);
            newImage.setBytes(Base64.getDecoder().decode(imgInfo[1]));
            imageService.editImage(newImage);

            boolean result = userService.editUser(
                id,
                map.get("newEmail").toString(),
                map.get("newPassword").toString(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                Integer.parseInt(map.get("phoneNumber").toString()),
                ActivityLevel.valueOf(map.get("activityLevel").toString()),
                newImage,
                oldUser.getAuthProvider());

            log.info("edited user " + id);
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


    @MapTokenRequired
    @PostMapping(value = "/{userId}/user")
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

        userService.setPoints(user, (int) (user.getPoints() + ADD_FRIEND_BONUS));
        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }

    @MapTokenRequired
    @PostMapping(value = "/activity", consumes = "application/json", produces = "application/json")
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
                User owner = activity.getUser();
                owner.setPoints(
                    owner.getPoints() + HOST_JOIN_BONUS
                );
                log.debug("The registration was successful");
                header.add("Status", "200 OK");
                header.add("Content-Type", "application/json; charset=UTF-8");

                body.put("userId", String.valueOf(user.getUserId()));
                body.put("activityId", String.valueOf(activity.getActivityId()));

                userService.setPoints(user,
                    (int) (user.getPoints() +
                        JOIN_ACTIVITY_BONUS * MULTIPLIERS[activity.getActivityLevel().ordinal()]));
                return ResponseEntity
                    .ok()
                    .headers(header)
                    .body(formatJson(body));
            } else {
                log.error(
                    "Something wrong happened when trying to register the activity to the user");
                header.add("Status", "400 BAD REQUEST");
                header.add("Content-Type", "application/json; charset=UTF-8");


                body.put("error",
                    "Something wrong happened registering the coupling between user and activity");
                return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));

            }
        } catch (IllegalArgumentException e) {
            log.error("user is already registered to the activity: " + e.getMessage());
            body.put("error", "the user is already registered to the activity");
            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }
    }

    @PostMapping("")
    public ResponseEntity registerUser(@RequestBody HashMap<String, Object> map) {
        log.info("recieved postmapping to /user: " + map.toString());
        Map<String, String> body = new HashMap<>();

        if (userService.getUser(map.get("email").toString()) != null) {
            body.put("error", "a user with that email already exists!");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }

        Image image = imageService.createImage(map.get("image").toString());
        if (image == null) {
            body.put("error", "Something wrong happened with the image");
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
            image,
            Provider.LOCAL);
        log.info("created user with id: " + result.getUserId());
        HttpHeaders header = new HttpHeaders();

        header.add("Content-Type", "application/json; charset=UTF-8");
        log.info("created user " + result.getUserId() + " | " + result.getEmail());
        if (result != null) {
            log.info("created user");
            header.add("Status", "201 CREATED");

            body.put("id", String.valueOf(result.getUserId()));
            body.put("token", securityService.createToken(String.valueOf(result.getUserId()), (1000 * 60 * 60 * 24)));

            return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
        }
        log.error("Created user is null");
        header.add("Status", "400 BAD REQUEST");
        body.put("error", "Created user is null");
        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }

    @MapTokenRequired
    @PostMapping("/{userId}/rating")
    public ResponseEntity giveRating(@RequestBody HashMap<String, Object> map,
                                     @PathVariable Integer userId) {
        log.debug("Received mapping to 'user/{userId}/rating'");
        int fromUserId = Integer.parseInt(map.get("fromUserId").toString());
        int toUserId = Integer.parseInt(map.get("toUserId").toString());

        HttpHeaders header = new HttpHeaders();
        Map<String, String> body = new HashMap<>();

        if (fromUserId == toUserId) {
            body.put("error", "you cannot rate yourself");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }

        User fromUser = userService.getUser(fromUserId);
        User toUser = userService.getUser(toUserId);

        if (fromUser == null || toUser == null) {
            log.error("User is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The user does not exist");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        if(ratingService.ratingExists(fromUser, toUser)){
            body.put("error", "you've already rated that user");

            return ResponseEntity
                .badRequest()
                .body(formatJson(body));
        }

        int rating = Integer.parseInt(map.get("rating").toString());

        if (rating <= 0 || rating > 5) {
            log.error("The rating is " + rating);
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The rating is not between 1 and 5");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        if (!ratingService.addRating(rating, toUser, fromUser)) {
            log.error("Something wrong happened when trying to add rating");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "Something wrong happened when trying to add rating");

            return ResponseEntity
                .badRequest()
                .headers(header)
                .body(formatJson(body));
        }

        log.info("Rating added");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        body.put("userId", String.valueOf(toUser.getUserId()));

        return ResponseEntity
            .ok()
            .headers(header)
            .body(formatJson(body));
    }

    private boolean insertUserActivityCoupling(User user, Activity activity) {
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
