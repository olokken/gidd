package IDATT2106.team6.Gidd.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.Timestamp;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

import IDATT2106.team6.Gidd.repo.*;
import IDATT2106.team6.Gidd.models.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class ActivityServiceTest {
    @InjectMocks
    private ActivityService service;

    @Mock
    private ActivityRepo repo;
    private User user1 = new User(11, "1@1", "pass1", "Olav", "Skundeberg", 123,
            ActivityLevel.HIGH, new Image(),
            Provider.LOCAL);
    private User user2 = new User(22, "2@2", "pass2", "Ole", "Christian", 1232,
            ActivityLevel.HIGH, new Image(),
            Provider.LOCAL);

    private Activity activity1 = new Activity(121, "skrive tester",
            new Timestamp(2001, 9, 11, 9, 11, 59, 5 ),
            0, user1, 50, 5, "det som du gjør nå", new Image(),
            ActivityLevel.HIGH, null, 0.001, 0.005, null);

    private Activity activity2 = new Activity(122, "Gjøre brukertester",
            new Timestamp(2002, 9, 12, 9, 11, 59, 5 ),
            0, user1, 50, 5, "Møt folk, er det bra?", new Image(),
            ActivityLevel.HIGH, null, 0.001, 0.005, null);

    @BeforeEach
    public void setup(){
        Mockito.when(repo.findActivity(activity1.getActivityId())).thenReturn(activity1);
        Mockito.when(repo.findActivity(activity2.getActivityId())).thenReturn(activity2);

        Mockito.when(repo.getUsersFromActivity(activity1.getActivityId())).thenReturn(new ArrayList<User>());
        ArrayList<User> userlist2 = new ArrayList<>();
        userlist2.add(user2);
        Mockito.when(repo.getUsersFromActivity(activity2.getActivityId())).thenReturn(userlist2);
        Mockito.when(repo.findActivity(33)).thenReturn(null);
    }

    @Test
    public void getUserFromActivityTest(){
        //only creator
        List<User> activityUser1 = service.getUserFromActivity(activity1.getActivityId());
        List<User> activityUser2 = service.getUserFromActivity(activity2.getActivityId());

        //only creator
        assertEquals(1, activityUser1.size());
        assertEquals(user1, activityUser1.get(0));

        //creator and one participant
        assertEquals(2,  activityUser2.size());
        assertEquals(user1, activityUser2.get(0));
        assertEquals(user2, activityUser2.get(1));
        //invalid id should return empty list
        assertEquals(0, service.getUserFromActivity(33).size());
    }
    //resten av metodene blir banale med mocket repo
}
