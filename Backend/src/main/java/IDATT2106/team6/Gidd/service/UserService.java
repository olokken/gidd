package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.UserRepo;
import IDATT2106.team6.Gidd.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class UserService {
    private Logger log = new Logger(UserService.class.toString());
    @Autowired
    private UserRepo repo;

    public void testNewUser(User user){
        repo.addUser(user);
    }

    public User getUser(int userId){
        log.info("getting user with id " + userId);
        return repo.findUser(userId);
    }

	public boolean login(String email, String password){
        log.info("logging in user with email " + email);
		return getUser(email).verifyPassword(password);
	}

    public boolean updateUser(int id, String email, String password, String firstname, String surname,
    int phoneNumber, ActivityLevel activityLevel){
		User newUser = new User(id, email, password, firstname, surname, phoneNumber, activityLevel, null);
        log.info("updating user: " + newUser.toString());
        return repo.updateUser(newUser);
    }

    public User registerUser(int id, String email, String password, String firstname, String surname,
	    int phoneNumber, ActivityLevel activityLevel){

		User newUser = new User(id, email, password, firstname, surname, phoneNumber, activityLevel, null);
        log.info("creating new user: " + newUser.toString());
        boolean result = repo.addUser(newUser);
        log.info("adding new user was " + result);
        if(result) return newUser;
        return null;
    }

	public User getUser(String email){
        log.info("getting user by email: " + email);
		return repo.findUserByEmail(email);
	}

    public boolean addUserToActivity(int id, Activity activity, User user, Timestamp time){
        log.info("adding user with id " + id + " to activity " + activity.toString());
        return this.repo.addUserToActivity(id, activity, user, time);
    }

    public Integer getActivityUser(Activity activity, User user){
        log.info("getting id of connection between activity" + activity.toString() + " and user " + user.toString());
        return this.repo.getActivityUserId(activity.getActivityId(), user.getUserId());
    }

    public boolean removeActivity(int activityUserId, User user){
        log.info("removing connection with id " + activityUserId + " from user " + user.toString());
        return this.repo.removeActivity(activityUserId, user);
    }

    public ActivityUser getActivityUserById(int activityUserId){
        log.info("getting activies from user with id " + activityUserId);
        return this.repo.getActivityUserById(activityUserId);
    }

    public boolean deleteConnection(ActivityUser activityUser){
        log.info("deleting connection " + activityUser.toString());
        return this.repo.deleteConnection(activityUser);
    }

    public boolean deleteUser(int userId){
        log.info("deleting user " + userId);
        return repo.deleteUser(userId);
    }
}
