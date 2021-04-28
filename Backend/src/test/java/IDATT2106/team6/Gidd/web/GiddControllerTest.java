package IDATT2106.team6.Gidd.web;


import static IDATT2106.team6.Gidd.Constants.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.MOCK;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import IDATT2106.team6.Gidd.GiddApplication;
import IDATT2106.team6.Gidd.models.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import net.minidev.json.JSONArray;
import net.minidev.json.parser.JSONParser;
import org.hamcrest.Matchers;

import net.minidev.json.JSONObject;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = MOCK, classes = GiddApplication.class) // Spring
@AutoConfigureMockMvc // Trengs for å kunne autowire MockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GiddControllerTest {
    @Autowired
    private MockMvc mockMvc;

    private String token;
    private User user1;
    private User user2;
    private User user3;
    private User user4;
    private User user5;
    private Activity activity1;
    private FriendGroup group1;
    private FriendGroup group2;
    private FriendGroup group3;

    @BeforeAll
    public void beforeAll(){

        System.out.println("Beginning the tests!\n");

        user1 = new User(11, "1@1", "pass1", "Olav", "Skundeberg", 123,
                ActivityLevel.HIGH, new Image(),
                Provider.LOCAL);

        user2 = new User(22, "2@2", "pass2", "Ole", "Christian", 1232,
                ActivityLevel.HIGH, new Image(),
                Provider.LOCAL);

        group3 = new FriendGroup(0, "Den Kule Gruppen", user2);

        user3 = new User(33, "3@3", "pass3", "Hans jakob", "Matte", 1233,
                ActivityLevel.HIGH, new Image(),
                Provider.LOCAL);

        user4 = new User(44, "4@4", "pass4", "Jonas", "Støhre", 1234,
                ActivityLevel.HIGH, new Image(), Provider.LOCAL);

        user5 = new User(55, "5@5", "pass5", "Erna", "Solberg", 1235,
                ActivityLevel.LOW, new Image(), Provider.LOCAL);

        activity1 = new Activity(121, "skrive tester",
                new Timestamp(2001, 9, 11, 9, 11, 59, 5 ),
                0, user1, 50, group3, "det som du gjør nå", new Image(),
                ActivityLevel.HIGH, new ArrayList<>(), 0.001, 0.005, null);
                0, user1, 50, group3, "det som du gjør nå", new Image(),
                ActivityLevel.MEDIUM, new ArrayList<>(), 0.001, 0.005, null);

        group1 = new FriendGroup(1, "GruppeTest", user1);

        group2 = new FriendGroup(1, "GruppeTest", user1);
    }

  //  @Test
    void getActivity() throws Exception {
        mockMvc.perform(get("/activity")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.activity", Matchers.greaterThanOrEqualTo(0)));
    }

    @Test
    @Order(1)
    public void registerUserTest() throws Exception {
        //make new user
        System.out.println("test 1");
        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user1.getEmail() + "\"," +
                        "\"password\":\"" + 123 + "\"," +
                        "\"firstName\":\"" + user1.getFirstName() + "\"," +
                        "\"surname\":\"" + user1.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user1.getPhoneNumber() + "\"," +
                        "\"image\":\"" + "\"," +
                        "\"activityLevel\":\"" + user1.getActivityLevel() + "\"" +
                        "}"))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        String user2String = mockMvc.perform(get("/user/email/" + user1.getEmail())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(user2String);
        JSONObject idJson = (JSONObject) parser.parse(id);
        user1.setId(idJson.getAsNumber("id").intValue());
        assertEquals(user1.getEmail(), json.get("email"));
    }

    @Order(2)
    @Test
    public void registerUserWithAlreadyRegisteredEmailTest() throws Exception {
        System.out.println("test 2");
        String error = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user1.getEmail() + "\"," +
                        "\"password\":\"" + 123 + "\"," +
                        "\"firstName\":\"" + user1.getFirstName() + "\"," +
                        "\"surname\":\"" + user1.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user1.getPhoneNumber() + "\"," +
                        "\"activityLevel\":\"" + user1.getActivityLevel() + "\"" +
                        "}"))
                .andExpect(status().isBadRequest()).andExpect(MockMvcResultMatchers.jsonPath("$.error").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject JSONError = (JSONObject) parser.parse(error);
        assertEquals("a user with that email already exists!", JSONError.get("error"));
    }

    @Order(3)
    @Test
    public void loginTest() throws Exception {
        //login user from order 1
        System.out.println("test 3");
        String tolken = mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user1.getEmail() + "\"," +
                        "\"password\":\"" + 123 + "\"," +
                        "\"provider\": \"" + "LOCAL\"" +
                        "}"))
                .andExpect(status().isOk()).andExpect((MockMvcResultMatchers.jsonPath("$.id").exists()))
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(tolken);
        token = jsonObject.get("token").toString();
    }

    @Order(4)
    @Test
    public void newActivityTest() throws Exception {
        System.out.println("test 4");
        //create new activity
        int initialPoints = user1.getPoints();
        String id = mockMvc.perform(MockMvcRequestBuilders
                .post("/activity").contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"title\" : \"" + activity1.getTitle() + "\",\n" +
                        "    \"time\" : \"" + activity1.getTime() + "\",\n" +
                        "    \"repeat\" : " + activity1.getRepeat() + ",\n" +
                        "    \"userId\" : " + user1.getUserId() + ",\n" +
                        "    \"capacity\" : " + activity1.getCapacity() + ",\n" +
                        "    \"groupId\" : " + -1 + ",\n" +
                        "    \"description\" : \"" + activity1.getDescription() + "\",\n" +
                        "    \"image\" : \"\",\n" +
                        "    \"activityLevel\" : \"" + activity1.getActivityLevel() + "\",\n" +
                        "    \"tags\" : " + "\"Fisk\"" + ",\n" +
                        "    \"latitude\" : " + activity1.getLatitude() + ",\n" +
                        "    \"longitude\": " + activity1.getLongitude() + ",\n" +
                        "    \"equipmentList\": \"Fish\" ,\n" +
                        "    \"equipment\": \"Fish\" \n" +
                        "}")).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(id);

        activity1.setActivityId(json.getAsNumber("id").intValue());

        String activity2String = mockMvc.perform(get("/activity/" + json.getAsNumber("id"))
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject json2 = (JSONObject) parser.parse(activity2String);
        assertEquals(json.getAsNumber("id"), json2.getAsNumber("activityId"));

        //test that user is registered to own activty
        String userActivities = mockMvc.perform(get("/user/" + user1.getUserId() + "/activity")
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsString();

        JSONObject user1Activities = (JSONObject) parser.parse(userActivities);
        assertNotNull(user1Activities.get("activities"));
        System.out.println(userActivities);
        assertEquals(activity1.getActivityId(),
                ((JSONObject)((JSONArray)user1Activities.get("activities")).get(0))
                        .getAsNumber("activityId").intValue());

        //test that user is registered to own activty
        String activityString = mockMvc.perform(get("/activity/" + activity1.getActivityId() )
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsString();

        String user1Response = mockMvc.perform(get("/user/" + user1.getUserId()))
                .andReturn().getResponse().getContentAsString();

        JSONObject user1Json = (JSONObject) parser.parse(user1Response);

        JSONObject activityJson = (JSONObject) parser.parse(activityString);
        JSONArray userJsonArray = (JSONArray) (activityJson.get("registeredParticipants"));
        JSONObject firstParticipant = (JSONObject) userJsonArray.get(0);
        assertEquals(user1.getUserId(), firstParticipant.getAsNumber("userId").intValue());
        assertEquals(initialPoints + NEW_ACTIVITY_BONUS
        * MULTIPLIERS[activity1.getActivityLevel().ordinal()],
                user1Json.getAsNumber("points").intValue()
                );
        //only owner signed up
        assertEquals(1, userJsonArray.size());
    }

    @Order(5)
    @Test
    public void addNewActivityWithNoneExistingUserTest() throws Exception {
        System.out.println("test 5");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .post("/activity").contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"title\" : \"" + activity1.getTitle() + "\",\n" +
                        "    \"time\" : \"" + activity1.getTime() + "\",\n" +
                        "    \"repeat\" : " + activity1.getRepeat() + ",\n" +
                        "    \"userId\" : " + (-1) + ",\n" +
                        "    \"capacity\" : " + activity1.getCapacity() + ",\n" +
                        "    \"groupId\" : " + activity1.getGroup() + ",\n" +
                        "    \"description\" : \"" + activity1.getDescription() + "\",\n" +
                        "    \"image\" : \"\",\n" +
                        "    \"activityLevel\" : \"" + activity1.getActivityLevel() + "\",\n" +
                        "    \"tags\" : " + "\"Fisk\"" + ",\n" +
                        "    \"latitude\" : " + activity1.getLatitude() + ",\n" +
                        "    \"longitude\": " + activity1.getLongitude() + ",\n" +
                        "    \"equipmentList\": \"Fish\" ,\n" +
                        "    \"equipment\": \"Fish\" \n" +
                        "}")).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(error);
        assertEquals("invalid userID received", json.get("error"));
    }

    @Order(6)
    @Test
    public void editActivityTest() throws Exception{
        //edit activity from order 3
        System.out.println("test 6");
        HashMap<String, Object> newValues = new HashMap<String, Object>();
        newValues.put("title", "apie changed");
        newValues.put("time", "2011-10-02 18:48:05.123456");
        newValues.put("repeat", 0);
        newValues.put("userId", user1.getUserId());
        newValues.put("capacity", 5);
        newValues.put("description", "changed description");
        newValues.put("image", "");
        newValues.put("activityLevel", "HIGH");
      //newValues.put("tags", "fotball");
        newValues.put("latitude", 2.0);
        newValues.put("longitude", 0.1);
        newValues.put("equipments", "fish");

        mockMvc.perform(MockMvcRequestBuilders.put("/activity/" + activity1.getActivityId()).content("{" +
        "\"title\" :" + "\"" + newValues.get("title") + "\"" +
        ",\"time\" :"  + "\"" + newValues.get("time") + "\"" +
        ",\"repeat\" :" + newValues.get("repeat") + 
        ",\"userId\" :" + newValues.get("userId") +
        ",\"capacity\" :" + newValues.get("capacity") +
        ",\"description\" : \"" + newValues.get("description") + "\"" +
        ",\"image\" : \"" + newValues.get("image") + "\"" +
        ",\"activityLevel\" : \"" + newValues.get("activityLevel") + "\""+
        ",\"tags\" : \"" + newValues.get("tags") + "\"" +
        ",\"latitude\" :" + newValues.get("latitude") +
        ",\"longitude\":" + newValues.get("longitude") +
        ",\"equipmentList\": \"" + newValues.get("equipments") + "\"" +
    "}"  ).contentType(MediaType.APPLICATION_JSON).header("token", token)).andExpect(status().isOk());

        activity1.setActivityLevel(ActivityLevel.valueOf("HIGH"));
        String getActivityString = mockMvc.perform(get("/activity/" + activity1.getActivityId())).andDo(print())
        .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject activity1Json = (JSONObject) parser.parse(getActivityString);
        String equipments = activity1Json.get("equipments").toString();
        JSONArray array = (((JSONArray) parser.parse(equipments)));

        Iterator it = newValues.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            if(pair.getKey().equals("image")){
                assertEquals(String.valueOf((String.valueOf(pair.getValue()))),
                        String.valueOf(activity1Json.get(pair.getKey())).replaceAll("\\]|\\[|,",""));
            }else if(pair.getKey().equals("time")){
                assertEquals((Timestamp.valueOf(pair.getValue().toString())).getTime(), activity1Json.get(pair.getKey()));
            //Long.getLong(pair.getValue().toString()
            }else if(pair.getKey().equals("userId")){
                JSONObject user = (JSONObject) parser.parse(activity1Json.get("user").toString());
                assertEquals(pair.getValue(), user.get(pair.getKey()));
            }else if(pair.getKey().equals("equipments")){
                assertEquals(pair.getValue(), ((JSONObject)array.get(0)).get("description"));
            }
            else{
                assertEquals(pair.getValue(), activity1Json.get(pair.getKey()));
            }
        }
    }

    @Order(7)
    @Test
    public void editNoneExistingActivityAndUserTest() throws Exception {
        System.out.println("test 7");
        HashMap<String, Object> newValues = new HashMap<String, Object>();
        newValues.put("title", "apie changed");
        newValues.put("time", "2011-10-02 18:48:05.123456");
        newValues.put("repeat", 0);
        newValues.put("userId", user1.getUserId());
        newValues.put("capacity", 5);
        newValues.put("description", "changed description");
        newValues.put("image", "");
        newValues.put("activityLevel", "HIGH");
        //newValues.put("tags", "fotball");
        newValues.put("latitude", 2.0);
        newValues.put("longitude", 0.1);
        newValues.put("equipments", "fish");

        String error = mockMvc.perform(MockMvcRequestBuilders.put("/activity/" + (-1)).content("{" +
                "\"title\" :" + "\"" + newValues.get("title") + "\"" +
                ",\"time\" :"  + "\"" + newValues.get("time") + "\"" +
                ",\"repeat\" :" + newValues.get("repeat") +
                ",\"userId\" :" + newValues.get("userId") +
                ",\"capacity\" :" + newValues.get("capacity") +
                ",\"description\" : \"" + newValues.get("description") + "\"" +
                ",\"image\" : \"" + newValues.get("image") + "\"" +
                ",\"activityLevel\" : \"" + newValues.get("activityLevel") + "\""+
                ",\"tags\" : \"" + newValues.get("tags") + "\"" +
                ",\"latitude\" :" + newValues.get("latitude") +
                ",\"longitude\":" + newValues.get("longitude") +
                ",\"equipmentList\": \"" + newValues.get("equipments") + "\"" +
                "}"  ).contentType(MediaType.APPLICATION_JSON).header("token", token))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(error);
        assertEquals("user or activity is null", json.get("error"));

        String error2 = mockMvc.perform(MockMvcRequestBuilders.put("/activity/" + activity1.getActivityId()).content("{" +
                "\"title\" :" + "\"" + newValues.get("title") + "\"" +
                ",\"time\" :"  + "\"" + newValues.get("time") + "\"" +
                ",\"repeat\" :" + newValues.get("repeat") +
                ",\"userId\" : \"" + (-1) + "\"" +
                ",\"capacity\" :" + newValues.get("capacity") +
                ",\"description\" : \"" + newValues.get("description") + "\"" +
                ",\"image\" : \"" + newValues.get("image") + "\"" +
                ",\"activityLevel\" : \"" + newValues.get("activityLevel") + "\""+
                ",\"tags\" : \"" + newValues.get("tags") + "\"" +
                ",\"latitude\" :" + newValues.get("latitude") +
                ",\"longitude\":" + newValues.get("longitude") +
                ",\"equipmentList\": \"" + newValues.get("equipments") + "\"" +
                "}"  ).contentType(MediaType.APPLICATION_JSON).header("token", token))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONObject json2 = (JSONObject) parser.parse(error2);
        assertEquals("subject mismatch", json2.get("error"));
    }

    @Order(8)
    @Test
    public void getSingleActivityTest() throws Exception {
        //get activity from order 4 and threee
        System.out.println("test 8");
        String activity = mockMvc.perform(get("/activity/" + activity1.getActivityId())
        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(activity);
        assertEquals(activity1.getActivityId(), json.get("activityId"));
    }

    @Order(9)
    @Test
    public void getSingleNoneExistingActivityTest() throws Exception {
        System.out.println("test 9");
        String error = mockMvc.perform(get("/activity/" + (-1))
                .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(error);
        assertEquals("The activity does not exist", json.get("error"));
    }

    @Order(10)
    @Test
    public void registerUserToActivity() throws Exception {
        // register user 2
        System.out.println("test 10");
        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user2.getEmail() + "\"," +
                        "\"password\":\"" + 123 + "\"," +
                        "\"firstName\":\"" + user2.getFirstName() + "\"," +
                        "\"surname\":\"" + user2.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user2.getPhoneNumber() + "\"," +
                        "\"image\":\"" + "\"," +
                        "\"activityLevel\":\"" + user2.getActivityLevel() + "\"" +
                        "}"))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        int initialPoints = user2.getPoints();

        JSONParser parser = new JSONParser();
        JSONObject idJson = (JSONObject) parser.parse(id);
        user2.setId(idJson.getAsNumber("id").intValue());

        String addConnection =  mockMvc.perform(post("/user/activity").content("{" + 
            "\"activityId\":" + activity1.getActivityId() +
            ",\"userId\":" + user2.getUserId() +
            "}").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
            
        JSONObject addConnectionResponse = (JSONObject) parser.parse(addConnection);

        assertEquals(user2.getUserId(), addConnectionResponse.get("userId"));
        assertEquals(activity1.getActivityId(), addConnectionResponse.get("activityId"));

        String userActivities = mockMvc.perform(get("/user/" + user2.getUserId() + "/activity")
        .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn()
        .getResponse().getContentAsString();

        JSONObject user2Activities = (JSONObject) parser.parse(userActivities);
        assertNotNull(user2Activities.get("activities"));
        System.out.println(userActivities);
        assertEquals(activity1.getActivityId(), 
            ((JSONObject)((JSONArray)user2Activities.get("activities")).get(0))
            .getAsNumber("activityId").intValue());

        String user2AfterRegistering = mockMvc.perform(get("/user/" + user2.getUserId()))
                .andReturn().getResponse().getContentAsString();

        JSONObject user2Json = (JSONObject) parser.parse(user2AfterRegistering);
        ActivityLevel activityLevel = ActivityLevel.valueOf(String.valueOf((((JSONObject)((JSONArray)
                user2Activities.get("activities")).get(0))).get("activityLevel")));
        //points
        assertEquals(initialPoints + JOIN_ACTIVITY_BONUS
                * MULTIPLIERS[activityLevel.ordinal()], user2Json.getAsNumber("points").intValue());
    }

    @Order(11)
    @Test
    public void registerNoneExistentUserToNoneExistentActivityTest() throws Exception {
        System.out.println("test 11");

        String error =  mockMvc.perform(post("/user/activity").content("{" +
                "\"activityId\":" + (-1) +
                ",\"userId\":" + user2.getUserId() +
                "}").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The activity does not exist", jsonObject.get("error"));

        String error1 =  mockMvc.perform(post("/user/activity").content("{" +
                "\"activityId\":" + activity1.getActivityId() +
                ",\"userId\":" + (-1) +
                "}").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONObject jsonObject1 = (JSONObject) parser.parse(error1);
        assertEquals("The user does not exist", jsonObject1.get("error"));
    }

    @Order(12)
    @Test
    public void registerUserToAlreadyRegisteredActivity() throws Exception {
        System.out.println("test 12");
        String error =  mockMvc.perform(post("/user/activity").content("{" +
                "\"activityId\":" + activity1.getActivityId() +
                ",\"userId\":" + user2.getUserId() +
                "}").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("the user is already registered to the activity", jsonObject.get("error"));
    }

    @Order(13)
    @Test
    public void getAllActivitiesForUserTest() throws Exception{
        System.out.println("test 13");
        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user3.getEmail() + "\"," +
                        "\"password\":\"" + 123 + "\"," +
                        "\"firstName\":\"" + user3.getFirstName() + "\"," +
                        "\"surname\":\"" + user3.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user3.getPhoneNumber() + "\"," +
                        "\"image\":\"" + "\"," +
                        "\"activityLevel\":\"" + user3.getActivityLevel() + "\"" +
                        "}")).andReturn().getResponse().getContentAsString();


        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(id);

        user3.setId(json.getAsNumber("id").intValue());

        //for both user 1 and two
        mockMvc.perform(get("/user/" + user1.getUserId() + "/activity")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isNotEmpty());

        mockMvc.perform(get("/user/" + user2.getUserId() + "/activity")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isNotEmpty());

        mockMvc.perform(get("/user/" + user3.getUserId() + "/activity")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isEmpty());
    }

    @Order(14)
    @Test
    public void getAllActivitiesForNoneExistingUser() throws Exception {
        System.out.println("test 14");
        String error = mockMvc.perform(get("/user/" + (-1) + "/activity")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user does not exist", jsonObject.get("error"));
    }

    @Order(15)
    @Test
    public void getAllUsersFromActivityTest() throws Exception{
        //create new user, add to activity and check order
        System.out.println("test 15");

        mockMvc.perform(post("/user/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{"+
                    "\"userId\":" + "\"" + user3.getUserId() + "\"," +
                    "\"activityId\":" + "\"" + activity1.getActivityId() + "\"" +
                "}"
        )).andExpect(status().isOk());

        String order = mockMvc.perform(get("/activity/" + activity1.getActivityId() + "/user")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(MockMvcResultMatchers.jsonPath("$.user").exists())
        .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        System.out.println("order is " + order);
        JSONObject jsonOrder = (JSONObject) parser.parse(order);

        //order is supposed to be user1 -> user2 -> user3
        assertEquals(((JSONObject)((JSONArray)jsonOrder.get("user")).get(0)).get("userId"), user1.getUserId());
        assertEquals(((JSONObject)((JSONArray)jsonOrder.get("user")).get(1)).get("userId"), user2.getUserId());
        assertEquals(((JSONObject)((JSONArray)jsonOrder.get("user")).get(2)).get("userId"), user3.getUserId());
    }

    @Order(16)
    @Test
    public void getAllUserFromNoneExistingActivity() throws Exception {
        System.out.println("test 16");
        String error = mockMvc.perform(get("/activity/" + (-1) + "/user")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("no activity found", jsonObject.get("error"));
    }

    @Order(17)
    @Test
    public void removeUserFromActivityTest() throws Exception {
        //remove activity from user 3
        System.out.println("test 17");
        JSONParser parser = new JSONParser();
        int initialPoints = user2.getPoints();
        String user2BeforeDeleting = mockMvc.perform(get("/user/" + user2.getUserId()))
                .andReturn().getResponse().getContentAsString();

        JSONObject user2PreDeleteJson = (JSONObject) parser.parse(user2BeforeDeleting);

        mockMvc.perform(MockMvcRequestBuilders
        .delete("/user/" + user2.getUserId() + "/activity/" + activity1.getActivityId()))
        .andExpect(status().isOk());

        String order = mockMvc.perform(get("/activity/" + activity1.getActivityId() + "/user")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(MockMvcResultMatchers.jsonPath("$.user").exists())
        .andReturn().getResponse().getContentAsString();

        JSONObject jsonOrder  = (JSONObject) parser.parse(order);

        String csv = jsonOrder.get("user").toString();
        JSONArray array = (((JSONArray) parser.parse(csv)));
        assertEquals(2, array.size());
        assertEquals(((JSONObject) array.get(0)).get("userId"), user1.getUserId());
        assertEquals(((JSONObject) array.get(1)).get("userId"), user3.getUserId());

        String user2AfterRegistering = mockMvc.perform(get("/user/" + user2.getUserId()))
                .andReturn().getResponse().getContentAsString();

        JSONObject user2PostDeleteJson = (JSONObject) parser.parse(user2AfterRegistering);

        //points
        assertEquals(user2PreDeleteJson.getAsNumber("points").intValue() -
                        JOIN_ACTIVITY_BONUS * MULTIPLIERS[activity1.getActivityLevel().ordinal()]
                - HOST_JOIN_BONUS
                ,
                user2PostDeleteJson.getAsNumber("points").intValue());
    }

    @Order(18)
    @Test
    public void removeNoneExistingUserFromNoneExistentActivityTest() throws Exception {
        System.out.println("test 18");

        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + (-1) + "/activity/" + activity1.getActivityId()))
                .andExpect(status().isBadRequest()).andReturn()
                .getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user does not exist", jsonObject.get("error"));

        String error2 = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user2.getUserId() + "/activity/" + (-1)))
                .andExpect(status().isBadRequest()).andReturn()
                .getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("The activity does not exist", jsonObject2.get("error"));
    }

    @Order(19)
    @Test
    public void removeUserFromAnActivityItIsNotRegisteredToTest() throws Exception {
        System.out.println(19);

        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user2.getUserId() + "/activity/" + activity1.getActivityId()))
                .andExpect(status().isBadRequest()).andReturn()
                .getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user is not registered to the activity", jsonObject.get("error"));
    }

    @Order(20)
    @Test
    public void deleteUserTest() throws Exception {
        System.out.println("test 20");

        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user4.getEmail() + "\"," +
                        "\"password\":\"" + "pass4" + "\"," +
                        "\"firstName\":\"" + user4.getFirstName() + "\"," +
                        "\"surname\":\"" + user4.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user4.getPhoneNumber() + "\"," +
                        "\"image\":\"" + "\"," +
                        "\"activityLevel\":\"" + user4.getActivityLevel() + "\"" +
                        "}"))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject idJson = (JSONObject) parser.parse(id);
        user4.setId(idJson.getAsNumber("id").intValue());

        mockMvc.perform(get("/user/" + user4.getUserId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").isNotEmpty());


        String response = mockMvc.perform(MockMvcRequestBuilders
        .delete("/user/" + user4.getUserId()))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assert(response.equals("{}"));

        mockMvc.perform(get("/user/" + user4.getUserId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").doesNotExist());
    }

    @Order(21)
    @Test
    public void deleteNoneExistentUser() throws Exception {
        System.out.println("test 21");

        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + (-1)))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("deletion failed, are you sure the user with id -1 exists?", jsonObject.get("error"));
    }

    @Order(22)
    @Test
    public void deleteActivityTest() throws Exception {
        System.out.println("test 22");
        //delete activity and check that users are returned

        String id = mockMvc.perform(MockMvcRequestBuilders
                .post("/activity").contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"title\" : \"" + activity1.getTitle() + "\",\n" +
                        "    \"time\" : \"" + activity1.getTime() + "\",\n" +
                        "    \"repeat\" : " + activity1.getRepeat() + ",\n" +
                        "    \"userId\" : " + user1.getUserId() + ",\n" +
                        "    \"capacity\" : " + activity1.getCapacity() + ",\n" +
                        "    \"groupId\" : " + -1 + ",\n" +
                        "    \"description\" : \"" + activity1.getDescription() + "\",\n" +
                        "    \"image\" : \"" + 1101 + "\",\n" +
                        "    \"activityLevel\" : \"" + activity1.getActivityLevel() + "\",\n" +
                        "    \"tags\" : " + "\"Fisk\"" + ",\n" +
                        "    \"latitude\" : " + activity1.getLatitude() + ",\n" +
                        "    \"longitude\": " + activity1.getLongitude() + ",\n" +
                        "    \"equipmentList\": \"Fish\" ,\n" +
                        "    \"equipment\": \"Fish\" \n" +
                        "}")).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject initialPost = (JSONObject) parser.parse(id);

        String initialGet = mockMvc.perform(get("/activity/" + initialPost.getAsNumber("id"))
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject initialGetJson = (JSONObject) parser.parse(initialGet);
        assertEquals(initialPost.getAsNumber("id"), initialGetJson.getAsNumber("activityId"));

        String deletedResponse = mockMvc.perform(MockMvcRequestBuilders
                .delete("/activity/" + initialPost.getAsNumber("id")))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject deletedActivity = (JSONObject) parser.parse(deletedResponse);

        JSONArray participantsFromDeleted = (JSONArray) deletedActivity.get("users");
        for (int i = 0; i < participantsFromDeleted.size(); i++) {
            assertEquals(((JSONObject) participantsFromDeleted.get(i)).getAsNumber("points").intValue(),
                    ((JSONObject)(((JSONArray)initialGetJson.get("registeredParticipants")).get(i)))
                            .getAsNumber("points").intValue() - (i == 0 ? NEW_ACTIVITY_BONUS : JOIN_ACTIVITY_BONUS)
                    * MULTIPLIERS[activity1.getActivityLevel().ordinal()]
                    );
        }

        mockMvc.perform(get("/activity/" + initialPost.getAsNumber("id"))
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.activityId").doesNotExist());
    }

    @Order(23)
    @Test
    public void deleteNoneExistingActivity() throws Exception {
        System.out.println("test 23");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/activity/" + (-1)))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("the activity does not exist", jsonObject.get("error"));
    }

    @Order(24)
    @Test
    public void editUserTest() throws Exception {
        //edit user1
        System.out.println("test 24");
        HashMap<String, Object> newValues = new HashMap<String, Object>();
        newValues.put("email", user1.getEmail());
        newValues.put("newEmail", "ikhovind@mail.com");
        newValues.put("surname", "Sungsletta");
        newValues.put("firstName", "Erling");
        newValues.put("phoneNumber", 8);
        newValues.put("points", 15);
        newValues.put("password", "123");
        newValues.put("activityLevel", "MEDIUM");
        newValues.put("newPassword", "321");
        newValues.put("newImage", "");

        String id = mockMvc.perform(MockMvcRequestBuilders
                .put("/user/" + user1.getUserId()).contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"email\" : \"" + newValues.get("email") + "\",\n" +
                        "    \"surname\" : \"" + newValues.get("surname") + "\",\n" +
                        "    \"firstName\" : \"" + newValues.get("firstName") + "\",\n" +
                        "    \"newEmail\" : \"" + newValues.get("newEmail") + "\",\n" +
                        "    \"phoneNumber\" : " + newValues.get("phoneNumber") + ",\n" +
                        "    \"points\" : " +  newValues.get("points") + ",\n" +
                        "    \"password\" : \"" + newValues.get("password") + "\",\n" +
                        "    \"activityLevel\" : \"" + newValues.get("activityLevel") + "\",\n" +
                        "    \"image\":\"" + newValues.get("newImage") + "\"," +
                        "    \"newPassword\" : \"" + newValues.get("newPassword") + "\"\n" +
                        "}").header("token", token)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        
         String userString = mockMvc.perform(get("/user/" + user1.getUserId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject userJson = (JSONObject) parser.parse(userString);

        Iterator it = newValues.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            if(pair.getKey().equals("newEmail")){
                assertEquals(pair.getValue(), userJson.get("email"));
            }
            else if(!(pair.getKey().equals("email") ||
                    pair.getKey().equals("password") ||
                    pair.getKey().equals("newPassword") ||
                    pair.getKey().equals("points") ||
                    pair.getKey().equals("newImage"))) {
                assertEquals(pair.getValue(), userJson.get(pair.getKey()));
            }
        }
    }

    @Order(25)
    @Test
    public void editUserWithWrongEmailOrPasswordTest() throws Exception {
        System.out.println("test 25");
        HashMap<String, Object> newValues = new HashMap<String, Object>();
        newValues.put("email", user1.getEmail());
        newValues.put("newEmail", "ikhovind@mail.no");
        newValues.put("surname", "Sungsletta");
        newValues.put("firstName", "Erling");
        newValues.put("phoneNumber", 8);
        newValues.put("points", 15);
        newValues.put("password", "321");
        newValues.put("activityLevel", "MEDIUM");
        newValues.put("newPassword", "123");

        String error = mockMvc.perform(MockMvcRequestBuilders
                .put("/user/" + user1.getUserId()).contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"email\" : \"" + "1@1" + "\",\n" +
                        "    \"surname\" : \"" + newValues.get("surname") + "\",\n" +
                        "    \"firstName\" : \"" + newValues.get("firstName") + "\",\n" +
                        "    \"newEmail\" : \"" + newValues.get("newEmail") + "\",\n" +
                        "    \"phoneNumber\" : " + newValues.get("phoneNumber") + ",\n" +
                        "    \"points\" : " +  newValues.get("points") + ",\n" +
                        "    \"password\" : \"" + newValues.get("password") + "\",\n" +
                        "    \"activityLevel\" : \"" + newValues.get("activityLevel") + "\",\n" +
                        "    \"newPassword\" : \"" + newValues.get("newPassword") + "\"\n" +
                        "}").header("token", token)).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("Invalid Email or Password", jsonObject.get("error"));

        String error2 = mockMvc.perform(MockMvcRequestBuilders
                .put("/user/" + user1.getUserId()).contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"email\" : \"" + newValues.get("email") + "\",\n" +
                        "    \"surname\" : \"" + newValues.get("surname") + "\",\n" +
                        "    \"firstName\" : \"" + newValues.get("firstName") + "\",\n" +
                        "    \"newEmail\" : \"" + newValues.get("newEmail") + "\",\n" +
                        "    \"phoneNumber\" : " + newValues.get("phoneNumber") + ",\n" +
                        "    \"points\" : " +  newValues.get("points") + ",\n" +
                        "    \"password\" : \"" + 123 + "\",\n" +
                        "    \"activityLevel\" : \"" + newValues.get("activityLevel") + "\",\n" +
                        "    \"newPassword\" : \"" + newValues.get("newPassword") + "\"\n" +
                        "}").header("token", token)).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("Invalid Email or Password", jsonObject2.get("error"));
    }

    @Test
    @Order(26)
    public void addFriendTest() throws Exception{
        System.out.println("test 26");
        mockMvc.perform(post("/user/" + user1.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + user1.getUserId() + ",\n" +
                        "\"friendId\":" + user2.getUserId() + "}"
                )).andExpect(status().isOk());

        String friends1 = mockMvc.perform(get("/user/" + user1.getUserId() + "/user")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();

        assertEquals("[]", ((JSONObject)(parser.parse(friends1))).get("users").toString());

        String friendship1 = mockMvc.perform(get("/user/" + user1.getUserId() + "/user/" + user2.getUserId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assertEquals("SENT", ((JSONObject)(parser.parse(friendship1))).get("friendship").toString());

        mockMvc.perform(post("/user/" + user2.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + user2.getUserId() + ",\n" +
                        "\"friendId\":" + user1.getUserId() + "}"
                )).andExpect(status().isOk());

        String friends2 = mockMvc.perform(get("/user/" + user1.getUserId() + "/user")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject jsonOrder  = (JSONObject) parser.parse(friends2);

        String csv = jsonOrder.get("users").toString();
        JSONArray array = (((JSONArray) parser.parse(csv)));

        assertEquals(user2.getUserId(), ((JSONObject)array.get(0)).get("userId"));

        String friendship2 = mockMvc.perform(get("/user/" + user1.getUserId() + "/user/" + user2.getUserId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assertEquals("FRIENDS", ((JSONObject)(parser.parse(friendship2))).get("friendship").toString());
    }

    @Order(27)
    @Test
    public void addNoneExistingFriendTest() throws Exception {
        System.out.println("test 27");
        String error = mockMvc.perform(post("/user/" + user1.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + user1.getUserId() + ",\n" +
                        "\"friendId\":" + (-1) + "}"
                )).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("One of the users do not exist", jsonObject.get("error"));

        String error2 = mockMvc.perform(post("/user/" + user1.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + (-1) + ",\n" +
                        "\"friendId\":" + user2.getUserId() + "}"
                )).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("One of the users do not exist", jsonObject2.get("error"));
    }

    @Order(28)
    @Test
    public void addFriendshipThatAlreadyExistTest() throws Exception {
        System.out.println("test 28");
        String error = mockMvc.perform(post("/user/" + user1.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + user1.getUserId() + ",\n" +
                        "\"friendId\":" + user2.getUserId() + "}"
                )).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The users are already friends", jsonObject.get("error"));
    }

    @Order(29)
    @Test
    public void deleteFriend() throws Exception {
        System.out.println("test 29");
        String friends2 = mockMvc.perform(get("/user/" + user1.getUserId() + "/user")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonOrder  = (JSONObject) parser.parse(friends2);

        String csv = jsonOrder.get("users").toString();
        JSONArray array = (((JSONArray) parser.parse(csv)));

        assertEquals(user2.getUserId(), ((JSONObject)array.get(0)).get("userId"));

        mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user1.getUserId() + "/user/" + user2.getUserId()))
                .andExpect(status().isOk());

        String friends1 = mockMvc.perform(get("/user/" + user1.getUserId() + "/user")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        assertEquals("[]", ((JSONObject)(parser.parse(friends1))).get("users").toString());
    }

    @Order(30)
    @Test
    public void deleteFriendshipNoneExistingUsers() throws Exception {
        System.out.println("test 30");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + (-1) + "/user/" + user2.getUserId()))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("One of the users do not exist", jsonObject.get("error"));

        String error2 = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user1.getUserId() + "/user/" + (-1)))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("One of the users do not exist", jsonObject2.get("error"));
    }

    @Order(31)
    @Test
    public void deleteNoneExistentFriendship() throws Exception {
        System.out.println("test 31");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user1.getUserId() + "/user/" + user2.getUserId()))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The deleting went wrong", jsonObject.get("error"));
    }

    @Order(32)
    @Test
    public void addGroupTest() throws Exception {
        System.out.println("test 32");
        String groupId = mockMvc.perform(post("/group")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"groupName\": \"" + group1.getGroupName() + "\",\n" +
                        "\"userIds\": \"" + user3.getUserId() + "," + user2.getUserId() + "\"," +
                        "\"userId\": \"" + user1.getUserId() + "\"" +
                        "}"
                )).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject JSONid = (JSONObject) parser.parse(groupId);
        String id = JSONid.get("groupId").toString();

        group1.setGroupId(Integer.parseInt(id));

        String group = mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject JSONgroup = (JSONObject) parser.parse(group);

        assertEquals(group1.getGroupName(), JSONgroup.get("groupName").toString());
        assertEquals(String.valueOf(group1.getGroupId()), JSONgroup.get("groupId").toString());
    }

    @Order(33)
    @Test
    public void addGroupWithInvalidOwner() throws Exception {
        System.out.println("test 33");
        String error = mockMvc.perform(post("/group")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"groupName\": \"" + group1.getGroupName() + "\",\n" +
                        "\"userIds\": \"" + user3.getUserId() + "," + user2.getUserId() + "\"," +
                        "\"userId\": \"" + (-1) + "\"" +
                        "}"
                )).andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The owner does not exist", jsonObject.get("error"));
    }

    @Order(34)
    @Test
    public void addUserToGroup() throws Exception {
        System.out.println("test 34");
        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user5.getEmail() + "\"," +
                        "\"password\":\"" + 1235 + "\"," +
                        "\"firstName\":\"" + user5.getFirstName() + "\"," +
                        "\"surname\":\"" + user5.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user5.getPhoneNumber() + "\"," +
                        "\"image\":\"" + "\"," +
                        "\"activityLevel\":\"" + user5.getActivityLevel() + "\"" +
                        "}"))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject idJson = (JSONObject) parser.parse(id);
        user5.setId(idJson.getAsNumber("id").intValue());

        String groupId = mockMvc.perform(post("/group/" + group1.getGroupId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"groupId\":\"" + group1.getGroupId() + "\"," +
                        "\"userId\":\"" + user5.getUserId() + "\"}"))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.groupId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.groupId").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        JSONObject friendGroupId = (JSONObject) parser.parse(groupId);

        String group = mockMvc.perform(get("/group/" + friendGroupId.get("groupId"))
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject friendGroup = (JSONObject) parser.parse(group);
        String members = friendGroup.get("users").toString();
        JSONArray array = (((JSONArray) parser.parse(members)));

        assertTrue(array.size() == 4);
    }

    @Order(35)
    @Test
    public void addInvalidUserToInvalidGroup() throws Exception {
        System.out.println("test 35");
        String error = mockMvc.perform(post("/group/" + group1.getGroupId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"groupId\":\"" + (-1) + "\"," +
                        "\"userId\":\"" + user5.getUserId() + "\"}"))
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The friend group or the user does not exist", jsonObject.get("error"));

        String error2 = mockMvc.perform(post("/group/" + group1.getGroupId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"groupId\":\"" + group1.getGroupId() + "\"," +
                        "\"userId\":\"" + (-1) + "\"}"))
                .andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("The friend group or the user does not exist", jsonObject2.get("error"));
    }

    @Order(36)
    @Test
    public void removeUserFromGroupTest() throws Exception {
        System.out.println("test 36");
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + group1.getGroupId() + "/user/" + user3.getUserId()))
                .andExpect(status().isOk());

        String group = mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject friendGroup = (JSONObject) parser.parse(group);
        String members = friendGroup.get("users").toString();
        JSONArray array = (((JSONArray) parser.parse(members)));

        assertEquals(3, array.size());
    }

    @Order(37)
    @Test
    public void removeOwnerFromGroupTest() throws Exception {
        System.out.println("test 37");
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + group1.getGroupId() + "/user/" + user1.getUserId()))
                .andExpect(status().isBadRequest());

        String group2 = mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject friendGroup2 = (JSONObject) parser.parse(group2);
        String members2 = friendGroup2.get("users").toString();
        JSONArray array2 = (((JSONArray) parser.parse(members2)));

        assertEquals(3, array2.size());
    }

    @Order(38)
    @Test
    public void removeInvalidUserFormInvalidGroupTest() throws Exception {
        System.out.println("test 38");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + (-1) + "/user/" + user1.getUserId()))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The friend group or the user does not exist", jsonObject.get("error"));

        String error2 = mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + group1.getGroupId() + "/user/" + (-1)))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("The friend group or the user does not exist", jsonObject2.get("error"));
    }

    @Order(39)
    @Test
    public void removeAUserFromAGroupItIsNotPartOfTest() throws Exception {
        System.out.println("test 39");
        String response = mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + group1.getGroupId() + "/user/" + user3.getUserId()))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(response);
        assertEquals(group1.getGroupId(), jsonObject.get("groupId"));
    }

    @Order(40)
    @Test
    public void getGroupsForUserTest() throws Exception {
        System.out.println("test 40");
        String groupId = mockMvc.perform(post("/group")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"groupName\": \"" + group1.getGroupName() + "\",\n" +
                        "\"userIds\": \"" + user3.getUserId() + "," + user2.getUserId() + "\"," +
                        "\"userId\": \"" + user1.getUserId() + "\"" +
                        "}"
                )).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject JSONid = (JSONObject) parser.parse(groupId);
        String id = JSONid.get("groupId").toString();

        group2.setGroupId(Integer.parseInt(id));

        String groups = mockMvc.perform(get("/user/" + user1.getUserId() + "/group")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject friendGroups = (JSONObject) parser.parse(groups);
        String groups1 = friendGroups.get("groups").toString();
        JSONArray groupsArray = (((JSONArray) parser.parse(groups1)));

        assertEquals(2, groupsArray.size());

        String groups5 = mockMvc.perform(get("/user/" + user5.getUserId() + "/group")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject friendGroups5 = (JSONObject) parser.parse(groups5);
        String groups6 = friendGroups5.get("groups").toString();
        JSONArray groupsArray5 = (((JSONArray) parser.parse(groups6)));

        assertEquals(1, groupsArray5.size());
    }

    @Order(41)
    @Test
    public void getGroupsForInvalidUser() throws Exception {
        System.out.println("test 41");
        String error = mockMvc.perform(get("/user/" + (-1) + "/group")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user does not exist", jsonObject.get("error"));
    }

    @Order(42)
    @Test
    public void changeOwnerTest() throws Exception {
        System.out.println("test 42");
        String returnGroup = mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject JSONGroupReturn = (JSONObject) parser.parse(returnGroup);
        String owner = JSONGroupReturn.get("owner").toString();

        JSONObject JSONOwner = (JSONObject) parser.parse(owner);

        assertEquals(user1.getUserId(), Integer.parseInt(JSONOwner.get("userId").toString()));

        mockMvc.perform(MockMvcRequestBuilders
                .put("/group/" + group1.getGroupId()).contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{" +
                                "\"groupId\" : \"" + group1.getGroupId() + "\"," +
                                "\"newOwner\" : \"" + user2.getUserId() + "\"" +
                        "}"
                )).andExpect(status().isOk());

        String friendGroup = mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject JSONFriendGroup = (JSONObject) parser.parse(friendGroup);
        String owner2 = JSONFriendGroup.get("owner").toString();

        JSONObject JSONOwner2 = (JSONObject) parser.parse(owner2);

        assertEquals(user2.getUserId(), Integer.parseInt(JSONOwner2.get("userId").toString()));
    }

    @Order(43)
    @Test
    public void changeInvalidOwnerToInvalidGroupTest() throws Exception {
        System.out.println("test 43");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .put("/group/" + group1.getGroupId()).contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{" +
                                "\"groupId\" : \"" + (-1) + "\"," +
                                "\"newOwner\" : \"" + user2.getUserId() + "\"" +
                                "}"
                )).andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The friend group or the user does not exist", jsonObject.get("error"));

        String error2 = mockMvc.perform(MockMvcRequestBuilders
                .put("/group/" + group1.getGroupId()).contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{" +
                                "\"groupId\" : \"" + group1.getGroupId() + "\"," +
                                "\"newOwner\" : \"" + (-1) + "\"" +
                                "}"
                )).andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("The friend group or the user does not exist", jsonObject2.get("error"));
    }

    @Order(44)
    @Test
    public void deleteFriendGroupTest() throws Exception {
        System.out.println("test 44");
        String group = mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject JSONgroup = (JSONObject) parser.parse(group);

        assertEquals(group1.getGroupName(), JSONgroup.get("groupName").toString());
        assertEquals(String.valueOf(group1.getGroupId()), JSONgroup.get("groupId").toString());

        String deleteReturn = mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + group1.getGroupId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject JSONDeleteReturn = (JSONObject) parser.parse(deleteReturn);

        assertEquals("{}", JSONDeleteReturn.toString());

        mockMvc.perform(get("/group/" + group1.getGroupId())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Order(45)
    @Test
    public void deleteNoneExistingFriendGroup() throws Exception {
        System.out.println("test 45");
        String error = mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + (-1)))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);

        assertEquals("The deleting went wrong", jsonObject.get("error"));
    }

    @Order(46)
    @Test
    public void getFriendRequestsTest() throws Exception {
        System.out.println("test 46");
        mockMvc.perform(post("/user/" + user1.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + user1.getUserId() + ",\n" +
                        "\"friendId\":" + user3.getUserId() + "}"
                )).andExpect(status().isOk());

        String returnString = mockMvc.perform(get("/user/" + user3.getUserId() + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject friendRequestsJSON = (JSONObject) parser.parse(returnString);
        String friendRequests = friendRequestsJSON.get("users").toString();
        JSONArray friendRequestsArray = (((JSONArray) parser.parse(friendRequests)));

        assertEquals(1, friendRequestsArray.size());
    }

    @Order(47)
    @Test
    public void getFriendRequestInvalidUser() throws Exception {
        System.out.println("test 47");
        String error = mockMvc.perform(get("/user/" + (-1) + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user does not exist", jsonObject.get("error"));
    }

    @Order(48)
    @Test
    public void getSentFriendRequestsTest() throws Exception {
        System.out.println("test 48");
        String returnString = mockMvc.perform(get("/user/" + user1.getUserId() + "/pending")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject friendRequestsJSON = (JSONObject) parser.parse(returnString);
        String friendRequests = friendRequestsJSON.get("users").toString();
        JSONArray friendRequestsArray = (((JSONArray) parser.parse(friendRequests)));

        assertEquals(1, friendRequestsArray.size());
    }

    @Order(49)
    @Test
    public void getPendingFriendRequestInvalidUser() throws Exception {
        System.out.println("test 49");
        String error = mockMvc.perform(get("/user/" + (-1) + "/pending")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user does not exist", jsonObject.get("error"));
    }

    @Order(50)
    @Test
    public void giveRatingTest() throws Exception {
        System.out.println("test 50");
        mockMvc.perform(post("/user/" + user1.getUserId() + "/rating")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\": \"" + user1.getUserId() + "\",\n" +
                        "\"rating\": \"5\"" +
                        "}"
                )).andExpect(status().isOk());

        mockMvc.perform(post("/user/" + user1.getUserId() + "/rating")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\": \"" + user1.getUserId() + "\",\n" +
                        "\"rating\": \"1\"" +
                        "}"
                )).andExpect(status().isOk());

        String averageRespons = mockMvc.perform(get("/user/" + user1.getUserId() + "/rating")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();


        JSONParser parser = new JSONParser();
        JSONObject JSONAverage = (JSONObject) parser.parse(averageRespons);

        assertEquals(String.valueOf(3.0), JSONAverage.get("averageRating").toString());
    }

    @Order(51)
    @Test
    public void giveRatingInvalidUser() throws Exception {
        String error = mockMvc.perform(post("/user/" + user1.getUserId() + "/rating")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\": \"" + (-1) + "\",\n" +
                        "\"rating\": \"1\"" +
                        "}"
                )).andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The user does not exist", jsonObject.get("error"));
    }

    @Order(52)
    @Test
    public void giveInvalidRating() throws Exception {
        String error = mockMvc.perform(post("/user/" + user1.getUserId() + "/rating")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\": \"" + user1.getUserId() + "\",\n" +
                        "\"rating\": \"0\"" +
                        "}"
                )).andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(error);
        assertEquals("The rating is not between 1 and 5", jsonObject.get("error"));

        String error2 = mockMvc.perform(post("/user/" + user1.getUserId() + "/rating")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\": \"" + user1.getUserId() + "\",\n" +
                        "\"rating\": \"6\"" +
                        "}"
                )).andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        JSONObject jsonObject2 = (JSONObject) parser.parse(error2);
        assertEquals("The rating is not between 1 and 5", jsonObject2.get("error"));
    }

    @Order(53)
    @Test
    public void getChatTest() throws Exception {
        System.out.println("test 53");
        mockMvc.perform(get("/chat/" + 123))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error")
                        .value("the activity does not exist"));
        mockMvc.perform(get("/chat/" + activity1.getActivityId()))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.activity").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.messages").isArray());
    }

    @Order(54)
    @Test
    public void tearDown() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/group/" + group2.getGroupId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/activity/" + activity1.getActivityId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user1.getUserId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user2.getUserId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user3.getUserId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/user/" + user5.getUserId()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
