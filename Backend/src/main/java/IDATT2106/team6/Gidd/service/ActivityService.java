package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
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

    public void doNothing(){
        repo.doNothing();
    }


    public boolean addActivity(Activity activity) {
        log.info("adding new Activity: " + activity.toString());
        Timestamp currentTime = new Timestamp(new Date().getTime());
        activity.setTimeCreated(currentTime);

        return repo.addActivity(activity);
    }

    //Use addActivity(Activity) when you can, as it is easier to work with
    public void addActivity(int id, String title, Timestamp time, int repeat, User userId,
                            int capacity, int groupId, String description, byte[] image,
                            ActivityLevel activityLevel, List<Tag> tags,
                            double latitude, double longitude) {
        Date today = new Date();
        Timestamp currentTime = new Timestamp(today.getTime());

        Activity newActivity =
            new Activity(id, title, time, repeat, userId,
                capacity, groupId, description, image, activityLevel, tags,
                latitude, longitude, currentTime);

        repo.addActivity(newActivity);
    }

    public Activity findActivity(int activityId){
        return this.repo.findActivity(activityId);
    }

    public boolean addUserToActivity(int id, Activity activity, User user, Timestamp time){
        return this.repo.addUserToActivity(id, activity, user, time);
    }

    public ArrayList<Activity> getAllActivities(){
        return this.repo.getAllActivities();
    }

    public void testNewActivity(Activity object){
        repo.addActivity(object);
    }

    public boolean removeUserFromActivity(int activityUser, Activity activity){
        return this.repo.removeUserFromActivity(activityUser, activity);
    }

    public boolean editActivity(Activity activity){
        return repo.updateActivity(activity);
    }

    public Activity testGetActivity(int id) {
        return repo.findActivity(id);
    }
}
