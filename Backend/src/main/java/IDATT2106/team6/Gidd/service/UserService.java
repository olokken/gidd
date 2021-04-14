package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepo repo;

    public void testNewUser(User user){
        repo.addUser(user);
    }
}
