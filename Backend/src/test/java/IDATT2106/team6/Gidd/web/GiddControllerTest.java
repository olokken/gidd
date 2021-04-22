package IDATT2106.team6.Gidd.web;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.MOCK;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import IDATT2106.team6.Gidd.GiddApplication;
import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Provider;
import IDATT2106.team6.Gidd.models.User;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.mysql.cj.xdevapi.JsonArray;
import net.minidev.json.JSONArray;
import net.minidev.json.parser.JSONParser;
import org.hamcrest.Matchers;

import net.minidev.json.JSONObject;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
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

    @Autowired
    private GiddController controller;

    private User user1;
    private User user2;
    private User user3;
    private User user4;
    private Activity activity1;
    
   /* @Before
    public void initialize() throws Exception {
        System.out.println("Initalizing tests");

        user1 = new User(11, "1@1", "pass1", "Olav", "Skundeberg", 123, 
        ActivityLevel.HIGH,
        Provider.LOCAL);

        user2 = new User(22, "2@2", "pass2", "Ole", "Christian", 1232, 
        ActivityLevel.HIGH,
        Provider.LOCAL);

        user3 = new User(33, "3@3", "pass3", "Hans Jakob", "Matte", 1233,
        ActivityLevel.HIGH,
        Provider.LOCAL);

        user4 = new User(44, "4@4", "pass4", "Jonas", "Støhre", 1234,
        ActivityLevel.HIGH, Provider.LOCAL);

        user5 = new User(55, "5@5", "pass5", "Erna", "Solberg", 1235,
        ActivityLevel.HIGH, Provider.LOCAL);

        activity1 = new Activity(121, "skrive tester",
        new Timestamp(2001, 9, 11, 9, 11, 59, 5 ),
        0, user1, 50, 5, "det som du gjør nå", new byte[]{-5},
        ActivityLevel.HIGH, null, 0.001, 0.005, null);
    }*/

    @BeforeAll
    public void beforeAll(){
        System.out.println("Beginning a test!\n");


        user1 = new User(11, "1@1", "pass1", "Olav", "Skundeberg", 123,
                ActivityLevel.HIGH,
                Provider.LOCAL);

        user2 = new User(22, "2@2", "pass2", "Ole", "Christian", 1232,
                ActivityLevel.HIGH,
                Provider.LOCAL);

        user3 = new User(33, "3@3", "pass3", "Hans jakob", "Matte", 1233,
                ActivityLevel.HIGH,
                Provider.LOCAL);

        user4 = new User(44, "4@4", "pass4", "Jonas", "Støhre", 1234,
                ActivityLevel.HIGH, Provider.LOCAL);

        activity1 = new Activity(121, "skrive tester",
                new Timestamp(2001, 9, 11, 9, 11, 59, 5 ),
                0, user1, 50, 5, "det som du gjør nå", new byte[]{-5},
                ActivityLevel.HIGH, new ArrayList<>(), 0.001, 0.005, null);
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
    public void loginTest() throws Exception {
        //login user from order 1
        System.out.println("test 2");
        mockMvc.perform(post("/login").contentType(MediaType.APPLICATION_JSON)
        .content("{" +
                "\"email\":\"" + user1.getEmail() + "\"," +
                "\"password\":\"" + 123 + "\"," +
                "\"provider\": \"" + "LOCAL\"" +
                "}"))
                .andExpect(status().isOk()).andExpect((MockMvcResultMatchers.jsonPath("$.id").exists()));
    }

    @Order(3)
    @Test
    public void newActivityTest() throws Exception {
        System.out.println("test 3");
        //create new activity
        String id = mockMvc.perform(MockMvcRequestBuilders
                .post("/activity").contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"title\" : \"" + activity1.getTitle() + "\",\n" +
                        "    \"time\" : \"" + activity1.getTime() + "\",\n" +
                        "    \"repeat\" : " + activity1.getRepeat() + ",\n" +
                        "    \"userId\" : " + user1.getUserId() + ",\n" +
                        "    \"capacity\" : " + activity1.getCapacity() + ",\n" +
                        "    \"groupId\" : " + activity1.getGroupId() + ",\n" +
                        "    \"description\" : \"" + activity1.getDescription() + "\",\n" +
                        "    \"image\" : \"" + 1101 + "\",\n" +
                        "    \"activityLevel\" : \"" + activity1.getActivityLevel() + "\",\n" +
                        "    \"tags\" : " + "\"Fisk\"" + ",\n" +
                        "    \"latitude\" : " + activity1.getLatitude() + ",\n" +
                        "    \"longitude\": " + activity1.getLongitude() + ",\n" +
                        "    \"equipmentList\": \"Fish\" ,\n" +
                        "    \"equipment\": \"Fish\" \n" +
                        "}")).andExpect(status().isCreated()).andDo(print()).andReturn().getResponse().getContentAsString();

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
        JSONObject activityJson = (JSONObject) parser.parse(activityString);
        JSONArray userJsonArray = (JSONArray) (activityJson.get("registeredParticipants"));
        JSONObject firstParticipant = (JSONObject) userJsonArray.get(0);
        assertEquals(user1.getUserId(), firstParticipant.getAsNumber("userId").intValue());
        //only owner signed up
        assertEquals(1, userJsonArray.size());
    }

    @Order(4)
    @Test
    public void editActivityTest() throws Exception{
        //edit activity from order 3
        System.out.println("test 4");
        HashMap<String, Object> newValues = new HashMap<String, Object>();
        newValues.put("title", "apie changed");
        newValues.put("time", "2011-10-02 18:48:05.123456");
        newValues.put("repeat", 0);
        newValues.put("userId", user1.getUserId());
        newValues.put("capacity", 5);
        newValues.put("description", "changed description");
        newValues.put("image", 1101);
        newValues.put("activityLevel", "HIGH");
      //newValues.put("tags", "fotball");
        newValues.put("latitude", 2.0);
        newValues.put("longitude", 0.1);

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
    "}"  ).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

        String getActivityString = mockMvc.perform(get("/activity/" + activity1.getActivityId())).andDo(print())
        .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject activity1Json = (JSONObject) parser.parse(getActivityString);

        Iterator it = newValues.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry)it.next();
            if(pair.getKey().equals("image")){
                assertEquals(String.valueOf(Integer.parseInt(String.valueOf(pair.getValue()), 2)),
                        String.valueOf(activity1Json.get(pair.getKey())).replaceAll("\\]|\\[|,",""));
            }else if(pair.getKey().equals("time")){
                assertEquals((Timestamp.valueOf(pair.getValue().toString())).getTime(), activity1Json.get(pair.getKey()));
            //Long.getLong(pair.getValue().toString()
            }else if(pair.getKey().equals("userId")){
                JSONObject user = (JSONObject) parser.parse(activity1Json.get("user").toString());
                assertEquals(pair.getValue(), user.get(pair.getKey()));
            }
            else{;
                assertEquals(pair.getValue(), activity1Json.get(pair.getKey()));
            }
        }
    }
    
    @Order(5)
    @Test
    public void getSingleActivityTest() throws Exception{
        //get activity from order 4 and threee
        System.out.println("test 5");
        String activity = mockMvc.perform(get("/activity/" + activity1.getActivityId())
        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(activity);
        assertEquals(activity1.getActivityId(), json.get("activityId"));
    }
    @Order(6)
    @Test
    public void registerUserToActivity() throws Exception{
        // register user 2
        System.out.println("test 6");

        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user2.getEmail() + "\"," +
                        "\"password\":\"" + 123 + "\"," +
                        "\"firstName\":\"" + user2.getFirstName() + "\"," +
                        "\"surname\":\"" + user2.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user2.getPhoneNumber() + "\"," +
                        "\"activityLevel\":\"" + user2.getActivityLevel() + "\"" +
                        "}"))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        String user2String = mockMvc.perform(get("/user/email/" + user1.getEmail())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

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
    }
    @Order(7)
    @Test
    public void getAllActivitiesForUserTest() throws Exception{
        //for both user 1 and two
        System.out.println("test 7");
        mockMvc.perform(get("/user/" + user2.getUserId() + "/activity")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isNotEmpty());

        /*mockMvc.perform(get("/user/" + user2.getUserId() + "/activity")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isNotEmpty());

        mockMvc.perform(get("/user/" + user3.getUserId() + "/activity")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.activities").isEmpty());*/
    }

    @Order(8)
    @Test
    public void getAllUsersFromActivityTest() throws Exception{
        //create new user, add to activity and check order
        System.out.println("test 8");

        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
            "\"email\":\"" + user3.getEmail() + "\"," +
            "\"password\":\"" + 123 + "\"," +
            "\"firstName\":\"" + user3.getFirstName() + "\"," +
            "\"surname\":\"" + user3.getSurname() + "\"," +
            "\"phoneNumber\":\"" + user3.getPhoneNumber() + "\"," +
            "\"activityLevel\":\"" + user3.getActivityLevel() + "\"" +
        "}")).andReturn().getResponse().getContentAsString();


        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(id);

        user3.setId(json.getAsNumber("id").intValue());

        mockMvc.perform(post("/user/activity").contentType(MediaType.APPLICATION_JSON)
        .content("{"+
                    "\"userId\":" + "\"" + json.getAsNumber("id") + "\"," +
                    "\"activityId\":" + "\"" + activity1.getActivityId() + "\"" +
                "}"
        )).andExpect(status().isOk());

        String order = mockMvc.perform(get("/activity/" + activity1.getActivityId() + "/user")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(MockMvcResultMatchers.jsonPath("$.user").exists())
        .andReturn().getResponse().getContentAsString();

        System.out.println("order is " + order);
        JSONObject jsonOrder = (JSONObject) parser.parse(order);

        //order is supposed to be user1 -> user2 -> user3
        assertEquals(((JSONObject)((JSONArray)jsonOrder.get("user")).get(0)).get("userId"), user1.getUserId());
        assertEquals(((JSONObject)((JSONArray)jsonOrder.get("user")).get(1)).get("userId"), user2.getUserId());
        assertEquals(((JSONObject)((JSONArray)jsonOrder.get("user")).get(2)).get("userId"), user3.getUserId());
    }
    @Order(9)
    @Test
    public void deleteActivityToUserTest() throws Exception{
        //remove activity from user 3
        System.out.println("test 9");

        mockMvc.perform(MockMvcRequestBuilders
        .delete("/user/" + user2.getUserId() + "/activity/" + activity1.getActivityId()))
        .andExpect(status().isOk());

        String order = mockMvc.perform(get("/activity/" + activity1.getActivityId() + "/user")
        .accept(MediaType.APPLICATION_JSON))
        .andExpect(MockMvcResultMatchers.jsonPath("$.user").exists())
        .andReturn().getResponse().getContentAsString();

        JSONParser parser = new JSONParser();
        JSONObject jsonOrder  = (JSONObject) parser.parse(order);

        String csv = jsonOrder.get("user").toString();
        JSONArray array = (((JSONArray) parser.parse(csv)));
        assertEquals(2, array.size());
        assertEquals(((JSONObject) array.get(0)).get("userId"), user1.getUserId());
        assertEquals(((JSONObject) array.get(1)).get("userId"), user3.getUserId());

    }

    @Order(10)
    @Test
    public void deleteUserTest() throws Exception{
        System.out.println("test 10");

        String id = mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\"email\":\"" + user4.getEmail() + "\"," +
                        "\"password\":\"" + "pass4" + "\"," +
                        "\"firstName\":\"" + user4.getFirstName() + "\"," +
                        "\"surname\":\"" + user4.getSurname() + "\"," +
                        "\"phoneNumber\":\"" + user4.getPhoneNumber() + "\"," +
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

        //todo fill out after the todo in the delete mapping is complete
        // create one user
        // create new activity with owner the user from order 8
        // sign up new user to this activity
        // delete user from order 8
        // check that user is deleted and that the new user is returned
    }

    @Order(11)
    @Test
    public void deleteActivityTest() throws Exception {
        System.out.println("test 11");
        //delete activity and check that users are returned

        String id = mockMvc.perform(MockMvcRequestBuilders
                .post("/activity").contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"title\" : \"" + activity1.getTitle() + "\",\n" +
                        "    \"time\" : \"" + activity1.getTime() + "\",\n" +
                        "    \"repeat\" : " + activity1.getRepeat() + ",\n" +
                        "    \"userId\" : " + user1.getUserId() + ",\n" +
                        "    \"capacity\" : " + activity1.getCapacity() + ",\n" +
                        "    \"groupId\" : " + activity1.getGroupId() + ",\n" +
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
        JSONObject json = (JSONObject) parser.parse(id);

        String activity2String = mockMvc.perform(get("/activity/" + json.getAsNumber("id"))
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        JSONObject json2 = (JSONObject) parser.parse(activity2String);
        assertEquals(json.getAsNumber("id"), json2.getAsNumber("activityId"));

        String response = mockMvc.perform(MockMvcRequestBuilders
                .delete("/activity/" + json.getAsNumber("id")))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        mockMvc.perform(get("/activity/" + json.getAsNumber("id"))
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.activityId").doesNotExist());
    }

    @Order(12)
    @Test
    public void editUserTest() throws Exception {
        //edit user2
        System.out.println("test 12");
        HashMap<String, Object> newValues = new HashMap<String, Object>();
        newValues.put("email", user2.getEmail());
        newValues.put("newEmail", "ikhovind@mail.com");
        newValues.put("surname", "Sungsletta");
        newValues.put("firstName", "Erling");
        newValues.put("phoneNumber", 8);
        newValues.put("points", 15);
        newValues.put("password", "123");
        newValues.put("activityLevel", "MEDIUM");
        newValues.put("newPassword", "321");

        String id = mockMvc.perform(MockMvcRequestBuilders
                .put("/user/" + user2.getUserId()).contentType(MediaType.APPLICATION_JSON)
                .content("{\n" +
                        "    \"email\" : \"" + newValues.get("email") + "\",\n" +
                        "    \"surname\" : \"" + newValues.get("surname") + "\",\n" +
                        "    \"firstName\" : \"" + newValues.get("firstName") + "\",\n" +
                        "    \"newEmail\" : \"" + newValues.get("newEmail") + "\",\n" +
                        "    \"phoneNumber\" : " + newValues.get("phoneNumber") + ",\n" +
                        "    \"points\" : " +  newValues.get("points") + ",\n" +
                        "    \"password\" : \"" + newValues.get("password") + "\",\n" +
                        "    \"activityLevel\" : \"" + newValues.get("activityLevel") + "\",\n" +
                        "    \"newPassword\" : \"" + newValues.get("newPassword") + "\"\n" +
                        "}")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        
         String userString = mockMvc.perform(get("/user/" + user2.getUserId())
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
                    pair.getKey().equals("points"))) {
                assertEquals(pair.getValue(), userJson.get(pair.getKey()));
            }
        }
    }

    @Test
    @Order(13)
    public void addFriendTest() throws Exception{
        mockMvc.perform(post("/user/" + user1.getUserId() + "/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{" +
                        "\n\"userId\":" + user1.getUserId() + ",\n" +
                        "\"friendId\":" + user2.getUserId() + "}"
                )).andExpect(status().isOk());
    }

    @Test
    @Order(14)
    public void tearDown() throws Exception {
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
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
