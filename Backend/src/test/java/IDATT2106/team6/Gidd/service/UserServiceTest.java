package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @InjectMocks
    private UserService service;

    @Mock
    private UserRepo repo;
    private User user1 = new User(1, "1@1", "123", "Turid", "Berntsen", 123, ActivityLevel.HIGH, new Image(), Provider.LOCAL);
    private User user2 = new User(2, "2@2", "123", "Berit", "Turidsen", 123, ActivityLevel.HIGH, new Image(), Provider.LOCAL);
    private User user3 = new User(3, "3@3", "123", "Wenche", "Haugesund", 123, ActivityLevel.HIGH, new Image(), Provider.LOCAL);

    @BeforeEach
    public void setup(){
        Mockito.lenient().when(repo.updateUser(user1)).thenReturn(true);
        Mockito.lenient().when(repo.updateUser(user2)).thenReturn(true);
        Mockito.lenient().when(repo.updateUser(user3)).thenReturn(true);

        user1.getFriendList().add(user2);
        user2.getFriendList().add(user1);
        user3.getFriendList().add(user1);
    }

    @Test
    public void checkFriendships() {
        assertEquals(Friendship.FRIENDS, service.checkFriendship(user1, user2));
        assertEquals(Friendship.FRIENDS, service.checkFriendship(user2, user1));
        assertEquals(Friendship.SENT, service.checkFriendship(user3, user1));
        assertEquals(Friendship.RECEIVED, service.checkFriendship(user1, user3));
        assertEquals(Friendship.NOTHING, service.checkFriendship(user2, user3));
    }

    @Test
    public void deleteFriendship() {
        assertTrue(service.deleteFriendship(user1, user2));
        assertEquals(Friendship.NOTHING, service.checkFriendship(user1, user2));
        assertEquals(Friendship.NOTHING, service.checkFriendship(user2, user1));

        assertTrue(service.deleteFriendship(user3, user1));
        assertEquals(Friendship.NOTHING, service.checkFriendship(user1, user3));
        assertEquals(Friendship.NOTHING, service.checkFriendship(user3, user1));
    }
}
