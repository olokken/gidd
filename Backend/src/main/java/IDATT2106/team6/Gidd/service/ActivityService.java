package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.repo.ActivityRepo;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import IDATT2106.team6.Gidd.util.*;
@Service
public class ActivityService {
    private Logger log = new Logger(ActivityService.class.toString());
    @Autowired
    private ActivityRepo repo;

    public boolean addActivity(Activity activity) {
        Timestamp currentTime = new Timestamp(new Date().getTime());
        activity.setTimeCreated(currentTime);
        log.info("adding new Activity: " + activity.getActivityId() + ":" + activity.getTitle());
        return repo.addActivity(activity);
    }

    //Use addActivity(Activity) when you can, as it is easier to work with
    public void addActivity(int id, String title, Timestamp time, int repeat, User userId,
                            int capacity, int groupId, String description, Image image,
                            ActivityLevel activityLevel, List<Tag> tags,
                            double latitude, double longitude) {
        Date today = new Date();
        Timestamp currentTime = new Timestamp(today.getTime());
        Activity newActivity =
            new Activity(id, title, time, repeat, userId,
                capacity, groupId, description, image, activityLevel, tags,
                latitude, longitude, currentTime);
        log.info("adding new activity: " + newActivity.getActivityId());
        repo.addActivity(newActivity);
    }

    public Activity findActivity(int activityId){
        log.info("finding activity with id " + activityId);
        return this.repo.findActivity(activityId);
    }

    public boolean addUserToActivity(int id, Activity activity, User user, Timestamp time){
        log.info("adding user " + id + " to activity " + activity.getActivityId());
        return this.repo.addUserToActivity(id, activity, user, time);
    }

    public ArrayList<Activity> getAllActivities(){
        log.info("getting all activities");
        return this.repo.getAllActivities();
    }

    public void testNewActivity(Activity object){
        repo.addActivity(object);
    }

    public boolean removeUserFromActivity(int activityUser, Activity activity){
        log.info("removing user " + activityUser + " from activity " + activity.getActivityId());
        return this.repo.removeUserFromActivity(activityUser, activity);
    }

    public boolean editActivity(Activity activity){
        log.info("editing activity " + activity.getActivityId());
        return repo.updateActivity(activity);
    }

    public List<User> getUserFromActivity(int id){
        List<User> participants = new ArrayList<User>();
        if(getActivity(id) != null){
            participants = repo.getUsersFromActivity(id);
        }
        return participants;
    }

    public Activity getActivity(int id) {
        log.info("Getting activity with activityId " + id);
        return repo.findActivity(id);
    }

    public List<Activity> searchForActivityByTitle(String title){
        log.info("Searching for activity with title " + title);
        return repo.findActivitiesBasedOnTitle(title);
    }

    public boolean deleteActivity(int id){
        log.info("deleting activity with id: " + id);
        return repo.deleteActivity(id);
    }

    public List<Activity> filterByActivityLevel(int activityLevel){
        log.info("Filtering activities with activity level " + activityLevel);
        return repo.findActivityByActivityLevel(activityLevel);
    }

    public List<Object> filterByTag(int tagId){
        log.info("Filtering activities with tag " + tagId);
        return repo.filterActivitiesByTag(tagId);
    }

    public boolean addEquipmentToActivity(Activity activity){
        log.info("Adding equipment connection to activity" + activity.getActivityId());
        return repo.addEquipmentToActivity(activity);
    }

    public boolean updateEquipment(ActivityEquipment activityEquipment, Activity activity){
        return repo.updateActivity(activity) && repo.updateActivityEquipmentConnection(activityEquipment);
    }
}
