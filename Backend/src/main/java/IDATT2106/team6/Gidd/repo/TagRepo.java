package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.models.Tag;
import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class TagRepo extends GiddRepo {

    public TagRepo() throws IOException {
        connect();
    }

    public EntityManager getEm(){
        return super.emf.createEntityManager();
    }

    @Override
    public void connect() throws IOException {
        super.connect();
    }

    public boolean addTag(Tag tag){
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(tag);
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

    public boolean updateTag(Tag tag){
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.merge(tag);
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

    public Tag findTag(int tagId){
        EntityManager em = getEm();
        Tag tag = null;

        try {
            tag = em.find(Tag.class, tagId);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }
        return tag;
    }

    public Tag findTag(String tagName){
        EntityManager em = getEm();
        Tag tag;

        try{
            TypedQuery q = em.createQuery("SELECT a FROM Tag a WHERE a.description = ?1", Tag.class);
            q.setParameter(1, tagName);
            return (Tag) q.getSingleResult();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }finally {
            em.close();
        }
    }

    public boolean deleteTag(int tagId){
        EntityManager em = getEm();

        try{
            Tag tag = findTag(tagId);

            if(tag != null){
                em.getTransaction().begin();
                Tag temporaryTag = em.merge(tag);
                em.remove(temporaryTag);
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

    public ArrayList<Tag> getAllTags(){
        EntityManager em = getEm();
        List<Tag> allTags = null;

        try {
            Query q = em.createQuery("SELECT a FROM Tag a");
            allTags = q.getResultList();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }

        assert allTags != null;
        return new ArrayList<>(allTags);
    }
}
