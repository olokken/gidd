package IDATT2106.team6.Gidd.service;

import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.lenient;
import static org.junit.jupiter.api.Assertions.*;

import IDATT2106.team6.Gidd.repo.*;
import IDATT2106.team6.Gidd.service.*;
import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.util.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService service;

    @Mock
    private UserRepo repo;



    private User user1 = new User(11, "1@1", "pass1", "Olav", "Skundeberg", 123, 
    ActivityLevel.HIGH,
    Provider.LOCAL);
    private User user2 = new User(22, "2@2", "pass2", "Ole", "Christian", 1232, 
    ActivityLevel.HIGH,
    Provider.LOCAL);
    private User user3 = new User(33, "3@3", "pass3", "Hans jakob", "Matte", 1233, 
    ActivityLevel.HIGH,
    Provider.LOCAL);
    private User user4 = new User(44, "4@4", "pass4", "Jonas", "Støhre", 1234, 
    ActivityLevel.HIGH,
    Provider.LOCAL);
    private User user5 = new User(55, "5@5", "pass5", "Erna", "Solberg", 1235, 
    ActivityLevel.HIGH,
    Provider.LOCAL);
    ArrayList<User> allUsers;
    @BeforeEach
    public void setUp(){
        allUsers = (ArrayList<User>) Arrays.asList(user1,user2,user3,user4,user5);
        Mockito.when(repo.getAllUsers()).thenReturn(allUsers);
        Mockito.when(repo.findUser(11)).thenReturn(user1);
        Mockito.when(repo.findUser(22)).thenReturn(user2);
        Mockito.when(repo.findUser(33)).thenReturn(user3);

        Mockito.when(repo.findUserByEmail("1@1")).thenReturn(user1);
        Mockito.when(repo.findUserByEmail("2@3")).thenReturn(user2);
        Mockito.when(repo.findUserByEmail("3@3")).thenReturn(user3);

        //todo test activityUser
    }   

    //todo alle metodene i service kaller kun repo, ser ikke mye vits å teste disse med et mocket repo
}
