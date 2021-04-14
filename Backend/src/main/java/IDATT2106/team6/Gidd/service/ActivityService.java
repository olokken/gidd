package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityLevel;
import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.repo.ActivityRepo;
import IDATT2106.team6.Gidd.repo.GiddRepo;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {
    @Autowired
    ActivityRepo repo;

    public void doNothing(){
        repo.doNothing();
    }

    public void addActivity(/*int id, */String title, Timestamp time, int repeat, int userId,
                                        int capacity, int groupId, String description, byte[] image,
                                        ActivityLevel activityLevel, List<Tag> tags,
                                        double latitude, double longitude) {
        Date today = new Date();

        Activity newActivity =
            new Activity(getRandomID(), title, time, repeat, userId,
                capacity, groupId, description, image, activityLevel, tags,
                latitude, longitude, new Timestamp(today.getTime()));

        repo.addActivity(newActivity);
    }

    public void testNewActivity(Activity object){
        repo.addActivity(object);
    }

    private int getRandomID() {
        return 1;
    }
}
