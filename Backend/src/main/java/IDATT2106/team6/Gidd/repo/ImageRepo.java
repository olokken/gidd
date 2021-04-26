package IDATT2106.team6.Gidd.repo;

import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.util.Logger;
import java.io.IOException;
import javax.persistence.EntityManager;
import org.springframework.stereotype.Repository;

@Repository
public class ImageRepo extends GiddRepo {
    private Logger log = new Logger(ImageRepo.class.toString());

    public ImageRepo() throws IOException {
        connect();
    }

    public EntityManager getEm(){
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
        }catch (Exception e){
            log.error("adding image failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }
}
