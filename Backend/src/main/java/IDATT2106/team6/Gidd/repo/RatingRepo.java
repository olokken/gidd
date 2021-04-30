package IDATT2106.team6.Gidd.repo;

import IDATT2106.team6.Gidd.models.Rating;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.IOException;
import java.util.List;

@Repository
public class RatingRepo extends GiddRepo {
    private Logger log = new Logger(UserRepo.class.toString());

    public RatingRepo() throws IOException {
        connect();
    }

    @Override
    public void connect() throws IOException {
        super.connect();
    }

    public EntityManager getEm() {
        return super.emf.createEntityManager();
    }

    public boolean addRating(Rating rating) {
        log.info("adding rating" + rating.getRatingId());
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.persist(rating);
            em.getTransaction().commit();
            log.info("added rating successfully " + rating.getRatingId());
            return true;
        } catch (Exception e) {
            log.error("adding rating " + rating.getRatingId() + "failed due to " + e.getMessage());
            return false;
        } finally {
            em.close();
        }
    }

    public boolean ratingExists(int from, int to) {
        log.info(String.format("checking if rating exists from %d to %d", from, to));
        EntityManager em = getEm();

        try {
            Query q = em.createNativeQuery("SELECT * FROM RATING WHERE from_user_id = ?1 AND to_user_id = ?2", Rating.class)
                .setParameter(1, from)
                .setParameter(2, to);
            boolean exists = !q.getResultList().isEmpty();
            return exists;
        } catch (Exception e) {
            log.error("ratingExists failed due to " + e.getMessage());
            return true;
        } finally {
            em.close();
        }
    }

    //todo why does this return a list

    /**
     * @return null if error happens
     */
    public List findAverage(int userId) {
        log.debug("Finding average rating for user " + userId);
        EntityManager em = getEm();

        try {
            Query q = em.createNativeQuery("SELECT AVG(rating) FROM RATING WHERE to_user_id = ?1")
                .setParameter(1, userId);
            return q.getResultList();
        } catch (Exception e) {
            log.error("getting average failed due to " + e.getMessage());
            return null;
        } finally {
            em.close();
        }
    }
}
