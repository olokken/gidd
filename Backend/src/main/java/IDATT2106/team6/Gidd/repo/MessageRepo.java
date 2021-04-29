package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import IDATT2106.team6.Gidd.models.*;
import org.springframework.stereotype.Repository;
import IDATT2106.team6.Gidd.util.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class MessageRepo extends GiddRepo {
    private Logger log = new Logger(MessageRepo.class.toString());
    @Override
    public void connect() throws IOException {
        super.connect();
    }

    public EntityManager getEm(){
        return super.emf.createEntityManager();
    }

    public boolean saveMessage(Chat chat){
        log.info("adding chat " + chat.getChatId());
        EntityManager em = getEm();

        try {

            em.getTransaction().begin();
            em.persist(chat);
            em.getTransaction().commit();
            try {
                List<User> users =
                        chat.getGroup()
                        .getRegisteredParticipants()
                        .stream().map(ActivityUser::getUser).collect(Collectors.toList());

                em.getTransaction().begin();
                for (User user : users) {
                    if(user.getUserId() != chat.getUser().getUserId()) {
                        user.addNotification(chat.getGroup());
                        em.merge(user);
                    }
                }
                em.getTransaction().commit();
            } catch (Exception e) {
                e.printStackTrace();
            }

            return true;
        }catch (Exception e){
            log.error("adding chat "+ chat.toString() + " failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    /**
     * Gets all messages sent in certain activity
     * @param activity
     * @return empty list if no chats are found or if error happens
     */
    public List<Chat> getAllChats(Activity activity){
        log.info("getting all tags");
        EntityManager em = getEm();
        List<Chat> groupMessages = null;

        try {

            Query q = em.createNativeQuery("SELECT * FROM CHAT WHERE group_id = ?1", Chat.class);
            q.setParameter(1, activity.getActivityId());
            groupMessages = q.getResultList();
            log.info("result list size is " + groupMessages.size());
        }catch (Exception e){
            log.error("getting all chats failed due to " + e.getMessage());
        }finally {
            em.close();
        }

        if(groupMessages == null){
            return new ArrayList<>();
        }
        return new ArrayList<>(groupMessages);
    }
}
