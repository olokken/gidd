package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.Chat;
import IDATT2106.team6.Gidd.models.Tag;
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
        log.info("adding chat" + chat.toString());
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(chat);
            em.getTransaction().commit();

            return true;
        }catch (Exception e){
            log.error("adding chat "+ chat.toString() + " failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public ArrayList<Chat> getAllChats(Activity activity){
        log.info("getting all tags");
        EntityManager em = getEm();
        List<Chat> groupMessages = null;

        try {
            PreparedStatement statement = new
            Query q = em.createQuery("SELECT a FROM Chat a where a.activity =?1", Chat.class);
            q.setParameter(1, activity);
            System.out.println("query is " + q.toString());
            groupMessages = q.getResultList();
        }catch (Exception e){
            log.error("getting all chats failed due to " + e.getMessage());
        }finally {
            em.close();
        }

        assert groupMessages != null;
        return new ArrayList<>(groupMessages);
    }
}
