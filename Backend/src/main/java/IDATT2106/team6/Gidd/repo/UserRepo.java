package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.models.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class UserRepo extends GiddRepo {

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
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.persist(user);
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

    public boolean update(User user){
        EntityManager em = getEm();

        try{
            em.getTransaction().begin();
            em.merge(user);
            em.getTransaction().commit();
            return true;
        }catch(Exception e){
            e.printStackTrace();
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public User findUser(int userId){
        EntityManager em = getEm();
        User user = null;

        try {
            user = em.find(User.class, userId);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }
        return user;
    }

    public boolean deleteUser(int userId){
        EntityManager em = getEm();

        try{
            User user = findUser(userId);

            if(user != null){
                em.getTransaction().begin();
                User temporaryUser = em.merge(user);
                em.remove(temporaryUser);
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

    public ArrayList<User> getAllTags(){
        EntityManager em = getEm();
        List<User> allUsers = null;

        try {
            Query q = em.createQuery("SELECT a FROM User a");
            allUsers = q.getResultList();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }

        assert allUsers != null;
        return new ArrayList<>(allUsers);
    }
}
