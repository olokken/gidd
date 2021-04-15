package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.models.Activity;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class ActivityRepo extends GiddRepo {

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
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(activity);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            e.printStackTrace();
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateActivity(Activity activity){
        EntityManager em = getEm();

        System.out.println(activity);

        try {
            em.getTransaction().begin();
            em.merge(activity);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            e.printStackTrace();
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public Activity findActivity(int activityId){
        EntityManager em = getEm();
        Activity activity = null;

        try {
            activity = em.find(Activity.class, activityId);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }finally {
            em.close();
        }
        return activity;
    }

    public boolean deleteActivity(int activityId){
        EntityManager em = getEm();

        try{
            Activity activity = findActivity(activityId);

            if(activity != null){
                em.getTransaction().begin();
                Activity temporaryActivity = em.merge(activity);
                em.remove(temporaryActivity);
                em.getTransaction().commit();
                return true;
            }else {
                em.getTransaction().rollback();
                return false;
            }
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }finally {
            em.close();
        }
    }

    public ArrayList<Activity> getAllActivities(){
        EntityManager em = getEm();
        List<Activity> allActivities = null;

        try {
            Query q = em.createQuery("SELECT a FROM Activity a");
            allActivities = q.getResultList();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }

        assert allActivities != null;
        return new ArrayList<>(allActivities);
    }
}
