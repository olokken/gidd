package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityEquipment;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.util.*;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class ActivityRepo extends GiddRepo {
    private Logger log = new Logger(ActivityRepo.class.toString());
    public ActivityRepo() throws IOException {
        connect();
    }

    public void doNothing(){
        System.out.println("haha i did something");
    }

    public EntityManager getEm(){
        return super.emf.createEntityManager();
    }

    @Override
    public void connect() throws IOException {
        super.connect();
    }

    public boolean addActivity(Activity activity){
        log.info("adding activity " + activity.toString());
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(activity);
            em.getTransaction().commit();
            log.info("added activity successfully");
            return true;
        }catch (Exception e){
            log.error("adding activity failed due to: " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateActivity(Activity activity){
        EntityManager em = getEm();
        log.info("updating activity " + activity.toString());
        try {
            em.getTransaction().begin();
            em.merge(activity);
            em.getTransaction().commit();
            log.info("activity updated successfully");
            return true;
        }catch (Exception e){
            log.error("updating activity failed due to: " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public Activity findActivity(int activityId){
        EntityManager em = getEm();
        Activity activity = null;
        log.info("finding activity with id " + activityId);
        try {
            activity = em.find(Activity.class, activityId);
        }catch (Exception e){
            log.error("returning null, finding activity failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
        log.info("activity found successfully: " + String.valueOf(activity));
        return activity;
    }

    public boolean deleteActivity(int activityId){
        EntityManager em = getEm();
        log.info("deleting activity with id: " + activityId);
        try{
            Activity activity = findActivity(activityId);
            
            if(activity != null){
                log.info("activity found, attempting delete");
                em.getTransaction().begin();
                Activity temporaryActivity = em.merge(activity);
                em.remove(temporaryActivity);
                em.getTransaction().commit();
                log.info("delete success on id: " + activityId);
                return true;
            }else {
                log.error("failed finding activity, cannot delete activity with id: " + activityId);
                em.getTransaction().rollback();
                return false;
            }
        }catch (Exception e){
            log.info("deleting activity: " + activityId + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public boolean addUserToActivity(int id, Activity activity, User user, Timestamp time){
        ActivityUser activityUser = new ActivityUser(id, activity, user, time);
        activity.addParticipant(activityUser);
        log.info("adding user " + id + " to activity: " + activity.toString());
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.merge(activity);
            em.getTransaction().commit();
            log.info("successfully adder user " + id + " to activity " + activity.toString());
            return true;
        }catch (Exception e){
            log.error("adding user " + id + 
            " to activity " + activity.toString() +
             " failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public boolean removeUserFromActivity(int activityUserId, Activity activity){
        EntityManager em = getEm();
        log.info("removing user " + activityUserId + " from activity " + activity.toString());
        try{
            for(ActivityUser as : activity.getRegisteredParticipants()){
                if(as.getId() == activityUserId){
                    log.info("found user id " + activityUserId + " in activity " + activity.toString());
                    activity.getRegisteredParticipants().remove(as);
                    break;
                }
            }
            em.getTransaction().begin();
            em.merge(activity);
            em.flush();
            em.getTransaction().commit();
            log.info("user " + activityUserId + " removed successfully from activity " + activity.toString());
            return true;
        }catch (Exception e){
            log.error("removing user " + activityUserId + " from activity " + activity.toString() + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public List<Activity> findActivitiesBasedOnTitle(String title){
        EntityManager em = getEm();
        log.info("finding activities with title " + title);
        try{
            Query q = em.createNativeQuery("SELECT * FROM ACTIVITY WHERE title LIKE ?1", Activity.class)
                    .setParameter(1, "%" + title + "%");
            return q.getResultList();
        }catch (Exception e){
            log.error("finding activities with title " + title + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    public List<Activity> findActivityByActivityLevel(int activityLevel){
        EntityManager em = getEm();
        log.info("finding activities by activity level " + activityLevel);

        try{
            Query q = em.createNativeQuery("SELECT * FROM ACTIVITY WHERE activity_level = ?1", Activity.class)
                    .setParameter(1, activityLevel);
            return q.getResultList();
        }catch (Exception e){
            log.error("finding activities by activity level " + activityLevel + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    public List<User> getUsersFromActivity(int activityId){
        Activity foundActivity = findActivity(activityId);
        if(foundActivity != null) {
            List<ActivityUser> activityUsers = foundActivity.getRegisteredParticipants();
            Collections.sort(activityUsers, new Comparator<ActivityUser>(){
                public int compare(ActivityUser a1, ActivityUser a2){
                    return a1.getTimestamp().compareTo(a2.getTimestamp());
                }
            });
            return activityUsers.stream().map(a -> a.getUser()).collect(Collectors.toList());
        }
        return new ArrayList<User>();
    }

    public ArrayList<Activity> getAllActivities(){
        log.info("getting all activites");
        EntityManager em = getEm();
        List<Activity> allActivities = null;

        try {
            Query q = em.createNativeQuery("SELECT * FROM ACTIVITY", Activity.class);
            allActivities = q.getResultList();
        }catch (Exception e){
            log.error("getting all activites failed due to " + e.getMessage());
        }finally {
            em.close();
        }

        assert allActivities != null;
        return new ArrayList<>(allActivities);
    }

    public boolean addEquipmentToActivity(Activity activity, ActivityEquipment activityEquipment){
        log.debug("Adding equipment connection " + activityEquipment.toString() + " to activity " + activity.toString());
        EntityManager em = getEm();

        try{
            activity.addEquipment(activityEquipment);
            em.getTransaction().begin();
            em.merge(activity);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            log.error("Adding equipment failed due " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateActivityEquipmentConnection(ActivityEquipment activityEquipment){
        log.debug("Updating activity-equipment connection");
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.merge(activityEquipment);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            log.error("Updating the activity-equipment connection failed due " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }
}
