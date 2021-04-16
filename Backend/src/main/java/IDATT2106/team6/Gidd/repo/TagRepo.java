package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.util.*;
import IDATT2106.team6.Gidd.models.Tag;
import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class TagRepo extends GiddRepo {
    private Logger log = new Logger(TagRepo.class.toString());
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
        log.info("adding tag " + tag.toString());
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(tag);
            em.getTransaction().commit();
            
            return true;
        }catch (Exception e){
            log.error("adding tag "+ tag.toString() + " failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateTag(Tag tag){
        log.info("updating tag " + tag.toString());
        EntityManager em = getEm();

        try {
            
            em.getTransaction().begin();
            em.merge(tag);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            log.error("adding tag " + tag.toString() + " failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public Tag findTag(int tagId){
        log.info("finding tag " + tagId);
        EntityManager em = getEm();
        Tag tag = null;

        try {
            tag = em.find(Tag.class, tagId);
        }catch (Exception e){
            log.error("finding tag " + tagId + "failed due to " + e.getMessage());
        }finally {
            em.close();
        }
        return tag;
    }

    public Tag findTag(String tagName){
        log.info("finding tag by name " + tagName);
        EntityManager em = getEm();
        Tag tag;

        try{
            TypedQuery q = em.createQuery("SELECT a FROM Tag a WHERE a.description = ?1", Tag.class);
            q.setParameter(1, tagName);
            return (Tag) q.getSingleResult();
        }catch (Exception e){
            log.error("finding tag by name "+ tagName + " failed due to " + e.getMessage());
            return null;
        }finally {
            em.close();
        }
    }

    public boolean deleteTag(int tagId){
        EntityManager em = getEm();
        log.info("deleting tag " + tagId);
        try{
            Tag tag = findTag(tagId);

            if(tag != null){
                em.getTransaction().begin();
                Tag temporaryTag = em.merge(tag);
                em.remove(temporaryTag);
                em.getTransaction().commit();
                return true;
            }else {
                log.info("found no tag to delete " + tagId);
                em.getTransaction().rollback();
                return false;
            }
        }catch (Exception e){
            log.error("deleting tag " + tagId + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public ArrayList<Tag> getAllTags(){
        log.info("getting all tags");
        EntityManager em = getEm();
        List<Tag> allTags = null;

        try {
            Query q = em.createQuery("SELECT a FROM Tag a");
            allTags = q.getResultList();
        }catch (Exception e){
            log.error("getting all tags failed due to " + e.getMessage());
        }finally {
            em.close();
        }

        assert allTags != null;
        return new ArrayList<>(allTags);
    }
}
