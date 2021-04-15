package IDATT2106.team6.Gidd.controller;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.service.ActivityService;

import java.net.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;

import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity registerUser(@RequestBody HashMap<String, String> map){

	User result = userService.registerUser(map.get("email").toString(),
              map.get("password").toString(), map.get("firstName").toString(), map.get("surname"),
              Integer.parseInt(map.get("phoneNumber").toString()),
              ActivityLevel.valueOf(map.get("activityLevel").toString()));
	//todo return result of registering new user
        Map<String, String> body = new HashMap<>();

		if(result != null){
            body.put("id", String.valueOf(result.getUserId()));
			return new ResponseEntity<>(body, HttpStatus.CREATED); 
		}
        body.put("id", "error");
		return new ResponseEntity<>(body, HttpStatus.CONFLICT);	
    }

    @PostMapping("/login")
    public ResponseEntity loginUser(@RequestBody HashMap<String, String> map){
		boolean result = userService.login(map.get("email").toString(), map.get("password").toString());
        Map<String, String> body = new HashMap<>();
        if(result){
            body.put("id", String.valueOf(userService.getUser(map.get("email")).getUserId()));
			return new ResponseEntity<>(body, HttpStatus.OK); 
        }
        body.put("id", "invalid password");
		return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);	
    }
}
