package IDATT2106.team6.Gidd.web;

import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;
import static IDATT2106.team6.Gidd.web.ControllerUtil.getRandomID;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.FriendGroup;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.FriendGroupService;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.util.GroupMemberTokenRequired;
import IDATT2106.team6.Gidd.util.GroupTokenRequired;
import IDATT2106.team6.Gidd.util.Logger;
import IDATT2106.team6.Gidd.util.MapTokenRequired;
import IDATT2106.team6.Gidd.util.PathTwoTokenRequired;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/group")
public class GroupController {
    private static Logger log = new Logger(GroupController.class.toString());
    @Autowired
    private UserService userService;
    @Autowired
    private FriendGroupService friendGroupService;

    @PathTwoTokenRequired
    @DeleteMapping("/{groupId}/user/{userId}")
    public ResponseEntity removeUserFromGroup(@PathVariable Integer groupId, @PathVariable Integer userId){
        FriendGroup friendGroup = friendGroupService.getFriendGroup(groupId);
        User user = userService.getUser(userId);

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();

        if(user == null || friendGroup == null){
            log.error("The user or the friend group is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The friend group or the user does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(friendGroup.getUsers().size() <= 2){
            deleteGroup(groupId);
            log.info("The group was deleted");
            header.add("Status", "200 OK");
            header.add("Content-Type", "application/json; charset=UTF-8");

            return ResponseEntity
                    .ok()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(user.getUserId() == friendGroup.getOwner().getUserId()){
            log.error("The owner can not be removed");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The owner can not be removed");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(!friendGroupService.removeUserFromFriendGroup(friendGroup, user)){
            log.error("Something wrong happened when trying to remove the user from friend group");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "Something wrong happened when trying to remove the user from friend group");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        log.info("User was removed");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        body.put("groupId", String.valueOf(groupId));

        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @MapTokenRequired
    @PostMapping("")
    public ResponseEntity addNewGroup(@RequestBody Map<String, Object> map){
        String groupName = map.get("groupName").toString();
        String[] userIdsString = (map.get("userIds").toString()).split(",");
        int userId = Integer.parseInt(map.get("userId").toString());

        User owner = userService.getUser(userId);
        if(owner == null){
            log.error("The owner is null");
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            Map<String, String> body = new HashMap<>();

            body.put("error", "The owner does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        ArrayList<Integer> addedIds = new ArrayList<>();
        ArrayList<User> existingUsers = new ArrayList<>();
        for(String s : userIdsString){
            User user = userService.getUser(Integer.parseInt(s));
            if(!(user == null || addedIds.contains(user.getUserId()))){
                existingUsers.add(user);
                addedIds.add(user.getUserId());
            }
        }

        if(!addedIds.contains(owner.getUserId())) {
            existingUsers.add(owner);
        }

        ArrayList<Integer> groupIds = new ArrayList<>();
        for(FriendGroup friendGroup : friendGroupService.getAllFriendGroups()){
            groupIds.add(friendGroup.getGroupId());
        }

        int groupId = getRandomID();
        while(groupIds.contains(groupId)){
            groupId = getRandomID();
        }

        if(!(friendGroupService.addFriendGroup(groupId, groupName, existingUsers, owner))){
            HttpHeaders header = new HttpHeaders();
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            Map<String, String> body = new HashMap<>();

            body.put("error", "Something wrong happened when trying to add");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }
        HttpHeaders header = new HttpHeaders();
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");
        Map<String, String> body = new HashMap<>();

        body.put("groupId", String.valueOf(groupId));

        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @MapTokenRequired
    @PostMapping("/{groupId}/user")
    public ResponseEntity addUserToGroup(@RequestBody HashMap<String, Object> map) {
        log.info("Received PostMapping to '/group/{groupId}/user'");
        int groupId = Integer.parseInt(map.get("groupId").toString());
        int userId = Integer.parseInt(map.get("userId").toString());

        User user = userService.getUser(userId);
        FriendGroup friendGroup = friendGroupService.getFriendGroup(groupId);

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        if(user == null || friendGroup == null){
            log.error("The user or the friend group is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The friend group or the user does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(!friendGroupService.addUserToFriendGroup(friendGroup, user)){
            log.error("Something wrong happened when trying to add user to friend group");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "Something wrong happened when trying to add user to friend group");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        log.info("User added to friend group");
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        body.put("groupId", String.valueOf(groupId));

        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @GroupTokenRequired
    @PutMapping("/{groupId}")
    public ResponseEntity changeOwner(@RequestBody HashMap<String, Object> map){
        FriendGroup friendGroup = friendGroupService.getFriendGroup(Integer.parseInt(map.get("groupId").toString()));
        User owner = userService.getUser(Integer.parseInt(map.get("newOwner").toString()));

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        if(owner == null || friendGroup == null){
            log.error("The user or the friend group is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The friend group or the user does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        if(!friendGroupService.updateOwner(friendGroup, owner)){
            log.error("Something wrong happened when trying to change the owner");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "Something wrong happened when trying to change the owner");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        log.debug("The owner to group " + friendGroup.getGroupId() + " is now user " + owner.getUserId());
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        body.put("groupId", friendGroup.getGroupId().toString());

        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }

    @GetMapping("")
    public ResponseEntity getAllGroups(){
        log.debug("Received GetMapping to '/group'");
        List<FriendGroup> friendGroups = friendGroupService.getAllFriendGroups();

        HttpHeaders header = new HttpHeaders();
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        log.debug("Returning all groups");

        return ResponseEntity
                .ok()
                .headers(header)
                .body("{\"groups\":" + friendGroups.toString() + "}");
    }

    @GroupMemberTokenRequired
    @GetMapping(value = "/{groupId}")
    public ResponseEntity getFriendGroup(@PathVariable Integer groupId){
        log.debug("Received GetMapping to '/group/{groupId}'");
        FriendGroup friendGroup = friendGroupService.getFriendGroup(groupId);

        HttpHeaders header = new HttpHeaders();
        if(friendGroup == null){
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");
            HashMap<String, String> body = new HashMap<>();

            body.put("error", "The friend group does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
                .ok()
                .headers(header)
                .body(friendGroup.toString());
    }

    @GroupMemberTokenRequired
    @GetMapping("/{groupId}/activity")
    public ResponseEntity getActivitiesForGroup(@PathVariable Integer groupId){
        log.debug("Received GetMapping to '/group/{groupId}/activity'");
        FriendGroup friendGroup = friendGroupService.getFriendGroup(groupId);

        HttpHeaders header = new HttpHeaders();

        if(friendGroup == null){
            log.error("The friend group is null");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            HashMap<String, String> body = new HashMap<>();
            body.put("error", "The friend group does not exist");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }

        List<Activity> activities = friendGroupService.getActivitiesForGroup(friendGroup);

        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
                .ok()
                .headers(header)
                .body("{\"activities\" : " + activities.toString() + "}");
    }

    @GroupTokenRequired
    @DeleteMapping(value = "/{groupId}")
    public ResponseEntity deleteGroup(@PathVariable Integer groupId){
        log.debug("Received DeleteMapping to '/group/{groupId}");

        HttpHeaders header = new HttpHeaders();
        HashMap<String, String> body = new HashMap<>();
        if(!friendGroupService.deleteFriendGroup(groupId)){
            log.error("Something went wrong when trying to delete");
            header.add("Status", "400 BAD REQUEST");
            header.add("Content-Type", "application/json; charset=UTF-8");

            body.put("error", "The deleting went wrong");

            return ResponseEntity
                    .badRequest()
                    .headers(header)
                    .body(formatJson(body));
        }
        header.add("Status", "200 OK");
        header.add("Content-Type", "application/json; charset=UTF-8");

        return ResponseEntity
                .ok()
                .headers(header)
                .body(formatJson(body));
    }
}
