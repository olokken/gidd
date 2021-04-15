package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import org.springframework.stereotype.Service;
import java.util.Random;

import java.sql.Timestamp;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    public void testNewUser(User user){
        repo.addUser(user);
    }

    public User getUser(int userId){
        return repo.findUser(userId);
    }

	public boolean login(String email, String password){
		return getUser(email).verifyPassword(password);
	}

    public User registerUser(String email, String password, String firstname, String surname,
	    int phoneNumber, ActivityLevel activityLevel){
	    //todo generate random number from 0 to maxint
	    Random rand = new Random();
		int id = rand.nextInt();
		User newUser = new User(id > 0 ? id : -id, email, password, firstname, surname, phoneNumber, activityLevel, null);
		//todo call repo to register this new user
        boolean result = repo.addUser(newUser);
		return newUser;
    }

	public User getUser(String email){
		//todo call repo here
		return null;
	}

    public boolean addUserToActivity(int id, Activity activity, User user, Timestamp time){
        return this.repo.addUserToActivity(id, activity, user, time);
    }

    public Integer getActivityUser(Activity activity, User user){
        return this.repo.getActivityUserId(activity.getActivityId(), user.getUserId());
    }

    public boolean removeActivity(int activityUserId, User user){
        return this.repo.removeActivity(activityUserId, user);
    }

    public ActivityUser getActivityUserById(int activityUserId){
        return this.repo.getActivityUserById(activityUserId);
    }

    public boolean deleteConnection(ActivityUser activityUser){
        return this.repo.deleteConnection(activityUser);
    }

    public boolean deleteUser(int userId){
        return repo.deleteUser(user_id);
    }
}
