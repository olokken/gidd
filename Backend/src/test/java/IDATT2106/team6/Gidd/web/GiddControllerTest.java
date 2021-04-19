package IDATT2106.team6.Gidd.web;


import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.MOCK;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import IDATT2106.team6.Gidd.GiddApplication;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class) // JUnit
@SpringBootTest(webEnvironment = MOCK, classes = GiddApplication.class) // Spring
@AutoConfigureMockMvc // Trengs for å kunne autowire MockMvc
public class GiddControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IDATT2106.team6.Gidd.controller.GiddController controller;

    @Before
    public void initialize() throws Exception {
        System.out.println("Initalizing tests");
    }

    @BeforeEach
    public void beforeEach(){
        System.out.println("Beginning a test!\n");
    }

    @Test
    public void getActivity() throws Exception {
        mockMvc.perform(get("/activity").contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
