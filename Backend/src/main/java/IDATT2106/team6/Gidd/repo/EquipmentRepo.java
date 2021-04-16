package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import IDATT2106.team6.Gidd.util.*;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.ActivityEquipment;
import IDATT2106.team6.Gidd.models.Equipment;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class EquipmentRepo extends GiddRepo {
    private Logger log = new Logger(Equipment.class.toString());
    public EquipmentRepo() throws IOException {
        connect();
    }

    public EntityManager getEm(){
        return super.emf.createEntityManager();
    }

    @Override
    public void connect() throws IOException {
        super.connect();
    }

    public boolean addEquipment(Equipment equipment){
        EntityManager em = getEm();
        log.info("adding equipment " + equipment.toString());
        try {
            em.getTransaction().begin();
            em.persist(equipment);
            em.getTransaction().commit();
            log.info("successfully added equipment " + equipment.toString());
            return true;
        }catch (Exception e){
            log.error("adding equipment " + equipment.toString() + " failed due to " + equipment.toString());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public boolean updateEquipment(Equipment equipment){
        EntityManager em = getEm();
        log.info("updating equipment " + equipment.toString());
        try {
            em.getTransaction().begin();
            em.merge(equipment);
            em.getTransaction().commit();
            log.info("updated successfully " + equipment.toString());
            return true;
        }catch (Exception e){
            log.error("adding equipment " + equipment.toString() + " failed due to " + e.getMessage());
            em.getTransaction().rollback();
            return false;
        }finally {
            em.close();
        }
    }

    public Equipment findEquipment(int equipmentId){
        log.info("finding equipment " + equipmentId);
        EntityManager em = getEm();
        Equipment equipment = null;

        try {
            equipment = em.find(Equipment.class, equipmentId);
        }catch (Exception e){
            log.error("finding equipment " + equipmentId + " failed due to: " + e.getMessage());
        }finally {
            em.close();
        }
        return equipment;
    }

    public boolean deleteEquipment(int equipmentId){
        EntityManager em = getEm();
        log.info("deleting equipment " + equipmentId);
        try{
            Equipment equipment = findEquipment(equipmentId);

            if(equipment != null){
                log.info("found equipment " + equipmentId);
                em.getTransaction().begin();
                Equipment temporaryEquipment = em.merge(equipment);
                em.remove(temporaryEquipment);
                em.getTransaction().commit();
                log.info("deleting equipment " + equipmentId + " was successful");
                return true;
            }else {
                log.info("found no equipment " + equipmentId);
                em.getTransaction().rollback();
                return false;
            }
        }catch (Exception e){
            log.error("deleting equipment " + equipmentId + " failed due to " + e.getMessage());
            return false;
        }finally {
            em.close();
        }
    }

    public ArrayList<Equipment> getAllEquipment(){
        log.info("getting all equipment");
        EntityManager em = getEm();
        List<Equipment> allEquipment = null;

        try {
            Query q = em.createNativeQuery("SELECT * FROM EQUIPMENT", Equipment.class);
            allEquipment = q.getResultList();
        }catch (Exception e){
            log.error("finding all equipment failed due to " + e.getMessage());
        }finally {
            em.close();
        }

        assert allEquipment != null;
        return new ArrayList<>(allEquipment);
    }

    public Equipment findEquipmentByDescription(String description){
        EntityManager em = getEm();

        try{
            Query q = em.createNativeQuery("SELECT * FROM EQUIPMENT WHERE DESCRIPTION = ?1", Equipment.class)
                    .setParameter(1, description);

            return (Equipment) q.getSingleResult();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }finally {
            em.close();
        }
    }

    public boolean addEquipmentToActivity(Equipment equipment, ActivityEquipment activityEquipment){
        EntityManager em = getEm();

        try{
            equipment.addActivityToEquipment(activityEquipment);
            em.getTransaction().begin();
            em.merge(equipment);
            em.getTransaction().commit();
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
}
