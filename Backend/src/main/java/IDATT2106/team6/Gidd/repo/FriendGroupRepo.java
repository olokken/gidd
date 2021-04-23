package IDATT2106.team6.Gidd.repo;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.FriendGroup;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.IOException;
import java.util.List;

@Repository
public class FriendGroupRepo extends GiddRepo {
    private Logger log = new Logger(ActivityRepo.class.toString());

    public FriendGroupRepo() throws IOException {
        connect();
    }

    public EntityManager getEm(){
        return super.emf.createEntityManager();
    }

    public boolean addFriendGroup(FriendGroup friendGroup){
        log.debug("Adding friend group with id: " + friendGroup.getGroupId());
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(friendGroup);
            em.getTransaction().commit();
            log.info("Added friend group successfully");
            return true;
        }catch (Exception e){
            log.error("Adding friend group failed due to: " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public FriendGroup findFriendGroup(int friendGroupId){
        log.info("finding friend group " + friendGroupId );
        EntityManager em = getEm();

        try {
            return em.find(FriendGroup.class, friendGroupId);
        }catch (Exception e){
            log.error("finding friend group " + friendGroupId + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    public List<FriendGroup> getAllFriendGroups(){
        log.debug("Getting all friend groups");
        EntityManager em = getEm();

        try {
            Query q = em.createNativeQuery("SELECT * FROM FRIEND_GROUP", FriendGroup.class);
            return q.getResultList();
        }catch (Exception e){
            log.error("Getting friend groups failed due to: " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    public boolean deleteFriendGroup(int friendGroupId){
        log.info("deleting friend group with id: " + friendGroupId);
        EntityManager em = getEm();

        try{
            FriendGroup friendGroup = findFriendGroup(friendGroupId);

            if(friendGroup != null){
                log.info("found friend group " + friendGroupId +  " to be deleted");
                em.getTransaction().begin();
                FriendGroup temporaryFriendGroup = em.merge(friendGroup);
                em.remove(temporaryFriendGroup);
                em.getTransaction().commit();
                log.info("friend group " + friendGroupId + " deleted successfully");
                return true;
            }else {
                log.info("friend group to be deleted " + friendGroup + " not found");
                return false;
            }
        }catch (Exception e){
            log.error("deleting friend group " + friendGroupId + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }
}
