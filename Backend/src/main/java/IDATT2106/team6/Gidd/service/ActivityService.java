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

    /**
     * Used when a user wants to create a new activity. It takes a pre-created
     * Activity object, then sets it's timeCreated parameter to the current time
     * before passing it on to the repo class.
     *
     * @param activity a semi-complete Activity object
     * @return true if activity was added successfully, false if not
     */
    public boolean addActivity(Activity activity) {
        Timestamp currentTime = new Timestamp(new Date().getTime());
        activity.setTimeCreated(currentTime);
        log.info("adding new Activity: " + activity.getActivityId() + ":" + activity.getTitle());
        return repo.addActivity(activity);
    }

    public Activity findActivity(int activityId) {
        log.info("finding activity with id " + activityId);
        return this.repo.findActivity(activityId);
    }

    public boolean addUserToActivity(int id, Activity activity, User user, Timestamp time) {
        log.info("adding user " + id + " to activity " + activity.getActivityId());
        return this.repo.addUserToActivity(id, activity, user, time);
    }

    public ArrayList<Activity> getAllActivities() {
        log.info("getting all activities");
        return this.repo.getAllActivities();
    }

    public boolean removeUserFromActivity(int activityUser, Activity activity) {
        log.info("removing user " + activityUser + " from activity " + activity.getActivityId());
        return this.repo.removeUserFromActivity(activityUser, activity);
    }

    public boolean editActivity(Activity activity) {
        log.info("editing activity " + activity.getActivityId());
        return repo.updateActivity(activity);
    }

    /**
     * Calls {@link #getActivity(int) getActivity} to check if the passed integer belongs
     * to an existing activity. If an activity is found, an ArrayList with the activity's
     * participants is returned. If it is not found, an empty list is returned instead.
     *
     * @param id the activity to check
     * @return an ArrayList with User objects or empty
     */
    public List<User> getUserFromActivity(int id) {
        List<User> participants = new ArrayList<>();
        if (getActivity(id) != null) {
            participants = repo.getUsersFromActivity(id);
        }
        return participants;
    }

    public Activity getActivity(int id) {
        log.info("Getting activity with activityId " + id);
        return repo.findActivity(id);
    }

    public List<Activity> searchForActivityByTitle(String title) {
        log.info("Searching for activity with title " + title);
        return repo.findActivitiesBasedOnTitle(title);
    }

    public boolean deleteActivity(int id) {
        log.info("deleting activity with id: " + id);
        return repo.deleteActivity(id);
    }

    public List<Activity> filterByActivityLevel(int activityLevel) {
        log.info("Filtering activities with activity level " + activityLevel);
        return repo.findActivityByActivityLevel(activityLevel);
    }

    public List<Object> filterByTag(int tagId) {
        log.info("Filtering activities with tag " + tagId);
        return repo.filterActivitiesByTag(tagId);
    }

    public boolean addEquipmentToActivity(Activity activity) {
        log.info("Adding equipment connection to activity" + activity.getActivityId());
        return repo.addEquipmentToActivity(activity);
    }

    public boolean removeEquipmentFromActivity(ActivityEquipment ae) {
        return repo.removeActivityEquipmentConnection(ae);
    }

    /**
     * Called when attempting to update an activity's list of equipment, it calls
     * on both {@link ActivityRepo#updateActivity(Activity) updateActivity} and
     * {@link ActivityRepo#updateActivityEquipmentConnection(ActivityEquipment) updateActivityEquipmentConnection}
     * from the {@link ActivityRepo} class, then returns a boolean based on the result of these.
     *
     * @param activityEquipment an connection entity between an {@link Activity} and {@link Equipment}
     * @param activity the activity being updated
     * @return true if both method calls are successful
     */
    public boolean updateEquipment(ActivityEquipment activityEquipment, Activity activity) {
        return repo.updateActivity(activity) &&
            repo.updateActivityEquipmentConnection(activityEquipment);
    }
}
