package IDATT2106.team6.Gidd.controller;

<<<<<<< HEAD
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
=======
import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.gidd.service.UserService;
>>>>>>> 88848c5 (login/register service + controller waiting for repo)
import IDATT2106.team6.Gidd.service.ActivityService;
import java.util.HashMap;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.service.EquipmentService;
import IDATT2106.team6.Gidd.service.UserService;
import java.net.URI;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
=======
import org.springframework.web.bind.annotation.*;
>>>>>>> 88848c5 (login/register service + controller waiting for repo)

@Controller
public class GiddController {
    @Autowired
    private ActivityService activityService;
    @Autowired
    private EquipmentService equipmentService;
    @Autowired
    private UserService userService;
<<<<<<< HEAD

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

    private int getRandomID(){
        Random rand = new Random();
        return rand.nextInt();
=======
    @GetMapping("/hello")
    public String home(){
        return "hello world";
    }
    @PostMapping("/user")
    public String registerUser(@RequestBody HashMap<String, String> map){

	boolean result = userService.registerUser(map.get("email").toString(),
 32             map.get("password").toString(), map.get("firstName").toStr    ing(), map.get("surname"),
 33             Integer.parseInt(map.get("phoneNumber").toString()),
 34             ActivityLevel.valueOf(map.get("activityLevel").toString()));
	//todo return result of registering new user
	return "tester";
>>>>>>> 88848c5 (login/register service + controller waiting for repo)
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody Hashap<String, String> map){
		boolean result = userService.login(map.get("email").toString(), map.get("password").toString());
	    return "login-test";
    }

    
}
