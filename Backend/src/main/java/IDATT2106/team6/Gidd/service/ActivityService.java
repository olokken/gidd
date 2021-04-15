package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.ActivityRepo;
import IDATT2106.team6.Gidd.repo.GiddRepo;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import javax.management.BadAttributeValueExpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {
    @Autowired
    ActivityRepo repo;

    public void doNothing(){
        repo.doNothing();
    }


    public boolean addActivity(Activity activity) {
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

    public boolean editActivity(Activity activity){
        return repo.updateActivity(activity);
    }

    public void testNewActivity(Activity object){
        repo.addActivity(object);
    }

    public Activity testGetActivity(int id) {
        return repo.findActivity(id);
    }
}
