package IDATT2106.team6.Gidd.repo;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.util.Logger;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import org.springframework.stereotype.Repository;

@Repository
public class ImageRepo extends GiddRepo {
    private Logger log = new Logger(ImageRepo.class.toString());

    public ImageRepo() throws IOException {
        connect();
    }

    public EntityManager getEm() {
        return emf.createEntityManager();
    }

    public boolean addImage(Image image) {
        log.info("adding image of type" + image.getDatatype());
        EntityManager em = getEm();
        try {
            em.getTransaction().begin();
            em.persist(image);
            em.getTransaction().commit();

            return true;
        } catch (Exception e) {
            log.error("adding image failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        } finally {
            em.close();
        }
    }

    public boolean updateImage(Image image) {
        log.info("updating image of type" + image.getDatatype());
        EntityManager em = getEm();
        try {
            em.getTransaction().begin();
            em.merge(image);
            em.getTransaction().commit();

            return true;
        } catch (Exception e) {
            log.error("adding image failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        } finally {
            em.close();
        }
    }

    public boolean delImage(Image image) {
        log.info("deleting image with id"  + image.getId());
        EntityManager em = getEm();
        try {
            Image delImage = findImage(image.getId());

            if(delImage != null) {
                em.getTransaction().begin();
                Image tempImage = em.merge(delImage);
                em.remove(tempImage);
                em.getTransaction().commit();
                log.info("delete success on id: " + image.getId());
                return true;
            } else {
                log.debug("Could not find that image");
                return false;
            }
        } catch (Exception e) {
            log.error("deleting image failed due to " + e.getMessage());
            return false;
        } finally {
            em.close();
        }
    }

    public Image findImage(int imageId) {
        log.info("finding image with id " + imageId);
        EntityManager em = getEm();
        Image image;
        try {
            image = em.find(Image.class, imageId);

        } catch (Exception e) {
            log.debug("Could not find the image");
            return null;
        } finally {
            em.close();
        }

        return image;
    }

    public List<Image> getAllImages() {
        log.info("getting all images");
        EntityManager em = getEm();
        List<Image> allActivities;

        try {
            Query q = em.createNativeQuery("SELECT * FROM IMAGE", Image.class);
            allActivities = q.getResultList();
        }catch (Exception e){
            log.error("getting all images failed due to " + e.getMessage());
            return new ArrayList<>(){};
        }finally {
            em.close();
        }

        assert allActivities != null;
        return new ArrayList<>(allActivities);
    }
}
