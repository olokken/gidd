package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.Provider;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.UserRepo;
import IDATT2106.team6.Gidd.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import org.springframework.stereotype.Service;
import java.util.*;
import java.sql.Timestamp;

@Service
public class UserService {
    private Logger log = new Logger(UserService.class.toString());
    @Autowired
    private UserRepo repo;

    public User getUser(int userId){
        log.info("getting user with id " + userId);
        return repo.findUser(userId);
    }

	public boolean login(String email, String password){
        log.info("logging in user with email " + email);
		return getUser(email).verifyPassword(password);
	}

    public boolean editUser(int id, String email, String password, String firstname, String surname,
                            int phoneNumber, ActivityLevel activityLevel){
        try {
            log.debug("In editUser");
            List<User> friends = getUser(id).getFriendList();
            log.debug("Got friends");
            User newUser =
                new User(id, email, password, firstname, surname, phoneNumber, activityLevel, null);
            log.debug("Setting friends");
            newUser.setFriendList(friends);
            log.info("updating user: " + newUser.toString());

            return repo.updateUser(newUser);
        } catch(Exception e) {
            log.debug("An error was caught while updating user " + e.getMessage() + " | Local; " + e.getLocalizedMessage());
        }
        return false;
    }

    public List<User> getUsers(){
        log.info("getting all users");
        return repo.getAllUsers();
    }

    public User registerUser(int id, String email, String password, String firstname,
                             String surname,
                             int phoneNumber, ActivityLevel activityLevel,
                             Provider provider){

		User newUser = new User(id, email, password, firstname, surname, phoneNumber, activityLevel, null);
        log.info("creating new user: " + newUser.getUserId());
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

    public boolean updateUser(User user, User friend){
        log.debug("Adding friend to user and updating object");
        user.addFriend(friend);
        return repo.updateUser(user);
    }

    public boolean deleteFriendship(User user, User friend){
        log.debug("Deleting friendship between user " + user.getUserId() + " and user " + friend.getUserId());
        Boolean delete1 = null;
        Boolean delete2 = null;

        log.debug("Checking if the friendship exists");
        ArrayList<Integer> friendIds1 = new ArrayList<>();
        for(User u : user.getFriendList()){
            friendIds1.add(u.getUserId());
        }

        ArrayList<Integer> friendIds2 = new ArrayList<>();
        for(User u : friend.getFriendList()){
            friendIds2.add(u.getUserId());
        }

        log.debug("Removing friendship");
        if(friendIds1.contains(friend.getUserId())){
            for(User u : user.getFriendList()) {
                if(u.getUserId() == friend.getUserId()) {
                    user.getFriendList().remove(u);
                    delete1 = repo.updateUser(user);
                    break;
                }
            }
        }
        if(friendIds2.contains(user.getUserId())){
            for(User u : friend.getFriendList()) {
                if(u.getUserId() == user.getUserId()) {
                    friend.getFriendList().remove(u);
                    delete2 = repo.updateUser(friend);
                    break;
                }
            }
        }
        if(delete1 == null && delete2 == null){
            return false;
        }
        else if(delete1 == null){
            return delete2;
        }else if(delete2 == null){
            return delete1;
        }
        return (delete1 && delete2);
    }
}
