package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.gidd.service.UserService;
import IDATT2106.team6.Gidd.service.ActivityService;
import java.util.HashMap;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class GiddController {
    @Autowired
    private ActivityService activityService;
    @Autowired
    private EquipmentService equipmentService;
    @Autowired
    private UserService userService;
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
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody Hashap<String, String> map){
		boolean result = userService.login(map.get("email").toString(), map.get("password").toString());
	    return "login-test";
    }

    
}
