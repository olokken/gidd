package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.*;
import java.util.stream.Collectors;

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

    public EntityManager getEm(){
        return emf.createEntityManager();
    }

    public boolean addActivity(Activity activity){
        log.info("adding activity " + activity.getActivityId() + ":" + activity.getTitle());
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(activity);
            em.getTransaction().commit();
            log.info("added activity successfully");
            em.getEntityManagerFactory().getCache().evict(User.class);
            return true;
        }catch (Exception e){
            log.error("adding activity failed due to: " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateActivity(Activity activity){
        EntityManager em = getEm();
        log.info("updating activity " + activity.getActivityId());
        try {
            em.getTransaction().begin();
            em.merge(activity);
            em.getTransaction().commit();
            log.info("activity updated successfully");
            return true;
        }catch (Exception e){
            log.error("updating activity failed due to: " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public Activity findActivity(int activityId){
        EntityManager em = getEm();
        Activity activity;
        log.info("finding activity with id " + activityId);
        try {
            return em.find(Activity.class, activityId);
        }catch (Exception e){
            log.error("returning null, finding activity failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
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

                em.createQuery("DELETE FROM Chat WHERE activity = ?1")
                        .setParameter(1, activity)
                        .executeUpdate();

                em.remove(temporaryActivity);
                em.getTransaction().commit();
                log.info("delete success on id: " + activityId);
                em.getEntityManagerFactory().getCache().evict(User.class);

                return true;
            }else {
                log.error("failed finding activity, cannot delete activity with id: " + activityId);
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
        log.info("adding user " + id + " to activity: " + activity.getActivityId());
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.merge(activity);
            em.getTransaction().commit();
            log.info("successfully added user " + id + " to activity " + activity.getActivityId());
            em.getEntityManagerFactory().getCache().evict(User.class);
            return true;
        }catch (Exception e){
            log.error("adding user " + id + 
            " to activity " + activity.getActivityId() +
             " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public boolean removeUserFromActivity(int activityUserId, Activity activity){
        EntityManager em = getEm();
        log.info("removing user " + activityUserId + " from activity " + activity.getActivityId());
        try{
            for(ActivityUser as : activity.getRegisteredParticipants()){
                if(as.getId() == activityUserId){
                    log.info("found user id " + activityUserId + " in activity " + activity.getActivityId());
                    activity.getRegisteredParticipants().remove(as);
                    break;
                }
            }
            em.getTransaction().begin();
            em.merge(activity);
            em.flush();
            em.getTransaction().commit();
            log.info("user " + activityUserId + " removed successfully from activity " + activity.getActivityId());
            em.getEntityManagerFactory().getCache().evict(User.class);
            return true;
        }catch (Exception e){
            log.error("removing user " + activityUserId + " from activity " + activity.getActivityId() + " failed due to " + e.getMessage());
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

    public boolean addEquipmentToActivity(Activity activity){
        log.debug("Adding equipment connection to activity " + activity.getActivityId());
        EntityManager em = getEm();

        try{
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

    public ActivityEquipment findActivityEquipmentConnection(int id) {
        EntityManager em = getEm();
        ActivityEquipment ae;
        log.info("finding activity_equipment with id " + id);
        try {
            ae = em.find(ActivityEquipment.class, id);
        }catch (Exception e){
            log.error("returning null, finding activityequipment failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
        log.info("activity found successfully");
        return ae;
    }

    public boolean removeActivityEquipmentConnection(ActivityEquipment ae) {
        EntityManager em = getEm();
        log.info("deleting activity equipment id: " + ae.getId());
        try{
            ActivityEquipment activityEquipment = findActivityEquipmentConnection(ae.getId());

            if(activityEquipment != null){
                log.info("activity_equip found, attempting delete");
                em.getTransaction().begin();
                ActivityEquipment tempAE = em.merge(activityEquipment);
                em.remove(tempAE);
                em.getTransaction().commit();
                log.info("delete success on id: " + ae.getId());
                return true;
            }else {
                log.error("failed finding activity_equip, cannot delete activity_equip with id: " + ae.getId());
                return false;
            }
        }catch (Exception e){
            log.info("deleting activity_equip: " + ae.getId() + " failed due to " + e.getMessage());
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

    public List<Object> filterActivitiesByTag(int tagId){
        log.debug("Filtering activities by tag");
        EntityManager em = getEm();

        try{
            Query q = em.createNativeQuery("SELECT Activity_activity_id FROM ACTIVITY_TAG WHERE tags_tag_id = ?1")
                    .setParameter(1, tagId);
            log.debug("Returning results");
            return q.getResultList();
        }catch (Exception e){
            log.error("An error has occurred: " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }
}
