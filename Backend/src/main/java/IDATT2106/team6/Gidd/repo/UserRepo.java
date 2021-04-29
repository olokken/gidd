package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityUser;
import IDATT2106.team6.Gidd.models.Rating;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.util.*;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

@Repository
public class UserRepo extends GiddRepo {
    private Logger log = new Logger(UserRepo.class.toString());
    
    public UserRepo() throws IOException{
        connect();
    }

    @Override
    public void connect() throws IOException {
        super.connect();
    }

    public EntityManager getEm(){
        return super.emf.createEntityManager();
    }

    public boolean addUser(User user){
        log.info("adding a user" + user.getUserId() + " | " + user.getSurname());
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.persist(user);
            em.getTransaction().commit();
            log.info("added user successfully " + user.getUserId());
            return true;
        }catch (Exception e){
            log.error("adding user " + user.getUserId() + "failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateUser(User user){
        log.info("updating user " + user.getUserId());
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.merge(user);
            em.getTransaction().commit();
            log.info("successfully updated user " + user.getUserId());
            return true;
        }catch(Exception e){
            log.error("updating user: " + user.getUserId() + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    /**
     * @return null if no user is found
     */
    public User findUser(int userId){
        log.info("finding user " + userId );
        EntityManager em = getEm();
        User user = null;

        try {
            return user = em.find(User.class, userId);
        }catch (Exception e){
            log.error("finding user " + userId + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    public boolean deleteUser(int userId){
        log.info("deleting user with id: " + userId);
        EntityManager em = getEm();

        try{
            User user = findUser(userId);

            if(user != null){
                log.info("found user " + userId +  " to be deleted");
                em.getTransaction().begin();
                em.createQuery("DELETE FROM Rating WHERE toUser = ?1 OR fromUser = ?1", Rating.class)
                    .setParameter(1, user)
                    .executeUpdate();
                em.createQuery("DELETE FROM Chat WHERE user = ?1")
                        .setParameter(1, user)
                        .executeUpdate();
                em.createQuery("DELETE FROM Activity WHERE user = ?1")
                        .setParameter(1, user)
                        .executeUpdate();
                User temporaryUser = em.merge(user);
                em.remove(temporaryUser);
                em.getTransaction().commit();
                log.info("user " + userId + " deleted successfully");
                return true;
            }else {
                log.info("user to be deleted " + userId + " not found");
                em.getTransaction().rollback();
                return false;
            }
        }catch (Exception e){
            log.error("deleting user " + userId + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public boolean addUserToActivity(int couplingId, Activity activity, User user, Timestamp time){
        ActivityUser activityUser = new ActivityUser(couplingId, activity, user, time);
        user.addActivity(activityUser);
        log.info("adding user with coupling id" + couplingId + " to activity " + activity.getActivityId());
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.merge(user);
            em.getTransaction().commit();
            log.info("added user " + couplingId + " successfully to activity " + activity.getActivityId());
            return true;
        }catch (Exception e){
            log.error("adding user " + couplingId + " to activity " + activity.getActivityId() + " failed due to " + e.getMessage());
            
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    /**
     * gets the id of the coupling between user and activity in coupling table
     * @param activityId
     * @param userId
     * @return null if error happens or no result is found
     */
    public Integer getActivityUserId(int activityId, int userId){
        EntityManager em = getEm();
        log.info(" getting connection id betweedn activity and user "+ activityId + " , " + userId);
        try{
            Query q = em.createNativeQuery("SELECT ID FROM ACTIVITY_USER WHERE activity_id = ?1 AND user_id = ?2")
                    .setParameter(1, activityId)
                    .setParameter(2, userId);

            return (Integer)q.getSingleResult();
        }catch (Exception e){
            log.error("getting connection between " + activityId + " and " + userId + " failed due to" + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    /**
     * deletes coupling of user to activity
     * @param activityUserId the id of the coupling
     * @param user the id of the user
     * @return false if an exception is thrown, true if not
     */
    public boolean removeActivity(int activityUserId, User user){
        EntityManager em = getEm();
        log.info("deleting registration of user " + user.getUserId() + " to activity " + activityUserId);
        try{
            for(ActivityUser as : user.getActivities()){
                if(as.getId() == activityUserId){
                    user.getActivities().remove(as);
                    break;
                }
            }
            em.getTransaction().begin();
            em.merge(user);
            em.flush();
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            log.error("deleting registration of user " + user.getUserId() + " to activity " + activityUserId + " failed due to " + e.getMessage() );
            return false;
        }finally {
            em.close();
        }
    }

    /**
     * get object for coupling user and activity
     * @return null if error happens or no result is found
     */
    public ActivityUser getActivityUserById(int activityUserId){
        log.info("getting connection between user and activity " + activityUserId);
        EntityManager em = getEm();

        try{
            Query q = em.createNativeQuery("SELECT * FROM ACTIVITY_USER WHERE ID = ?1", ActivityUser.class)
                    .setParameter(1, activityUserId);
            return (ActivityUser)q.getSingleResult();
        }catch (Exception e){
            log.error("finding connection " + activityUserId + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    /**
     * deletes object for coupling activity and user in database
     */
    public boolean deleteConnection(ActivityUser activityUser){
        log.info("deleting connection " + activityUser);
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            ActivityUser temporaryActivityUser = em.merge(activityUser);
            em.remove(temporaryActivityUser);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            log.error("deleting connection " + activityUser.getId() + " failed due to "+ e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    /**
     * @return empty list if no result is found
     */
    public ArrayList<User> getAllUsers(){
        log.info("getting all users");
        EntityManager em = getEm();
        List<User> allUsers = null;

        try {
            Query q = em.createQuery("SELECT a FROM User a");
            allUsers = q.getResultList();
        }catch (Exception e){
            log.error("getting all users failed due to " + e.getMessage());
        }finally {
            em.close();
        }

        if(allUsers == null){
            return new ArrayList<>();
        }
        return new ArrayList<>(allUsers);
    }

    public User findUserByEmail(String email){
        EntityManager em = getEm();
        log.info("finding user by email " + email);
        try{
            TypedQuery q = em.createQuery("SELECT a FROM User a WHERE a.email = ?1", User.class);
            q.setParameter(1, email);
	    log.info("found single result with email: " + email);
            return (User)q.getSingleResult();
        }catch (Exception e){
            log.error("finding user with email " + email + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }
}
