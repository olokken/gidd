package IDATT2106.team6.Gidd.web;


import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.MOCK;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import IDATT2106.team6.Gidd.GiddApplication;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;

import IDATT2106.team6.Gidd.*;
import org.junit.Before;
import org.junit.jupiter.api.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RunWith(SpringRunner.class) // JUnit
@SpringBootTest(webEnvironment = MOCK, classes = GiddApplication.class) // Spring
@AutoConfigureMockMvc // Trengs for å kunne autowire MockMvc
public class GiddControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired

    private GiddController controller;
    @Before
    public void initialize() throws Exception {
        System.out.println("Initalizing tests");
    }

    @BeforeEach
    public void beforeEach(){
        System.out.println("Beginning a test!\n");
    }

    @Test
    void getActivity() throws Exception {
        mockMvc.perform(get("/activity")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.activity", Matchers.greaterThanOrEqualTo(0)));
    }
/*
    @Test
    void addActivity() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
            .post("/activity")
            .content()
    }
*/

    @Test
    @Order(1)
    public void registerUserTest(){
        //make new user
        System.out.println("test 1");
    }
    @Order(2)
    @Test
    public void loginTest(){
        //login user from order 1
        System.out.println("test 2");
    }
    @Order(12)
    @Test
    public void editUserTest(){
        //edit user from order(1)
    }

    @Order(3)
    @Test
    public void newActivityTest(){
        System.out.println("test 3");
        //create new activity
    }

    @Order(4)
    @Test
    public void editActivityTest(){
        //edit activity from order 3
        System.out.println("test 4");
    }
    @Order(5)
    @Test
    public void getSingleActivityTest(){
        //get activity from order 4 and threee
        System.out.println("test 5");
    }
    @Order(6)
    @Test
    public void registerUserToActivity(){
        //make new user here and register them
        System.out.println("test 6");
    }
    @Order(7)
    @Test
    public void getAllActivitiesForUserTest(){
        //for both user 1 and two
        System.out.println("test 7");
    }
    @Order(8)
    @Test
    public void getAllUsersFromActivityTest(){
        //create new user, add to activity and check order
        System.out.println("test 8");
    }
    @Order(9)
    @Test
    public void deleteActivityToUserTest(){
        //remove activity from user 3
        System.out.println("test 9");
    }
    @Order(10)
    @Test
    public void deleteUserTest(){
        //delete user from order 8
        System.out.println("test 10");
    }
    @Order(11)
    @Test
    public void deleteActivityTest(){
        System.out.println("test 11");
        //delete activity and check that users are returned in response in correct order
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
