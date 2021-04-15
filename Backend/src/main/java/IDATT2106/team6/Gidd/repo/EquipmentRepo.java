package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import IDATT2106.team6.Gidd.models.Equipment;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;

@Repository
public class EquipmentRepo extends GiddRepo {

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

        try {
            em.getTransaction().begin();
            em.persist(equipment);
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

    public boolean updateEquipment(Equipment equipment){
        EntityManager em = getEm();

        try {
            em.getTransaction().begin();
            em.merge(equipment);
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

    public Equipment findEquipment(int equipmentId){
        EntityManager em = getEm();
        Equipment equipment = null;

        try {
            equipment = em.find(Equipment.class, equipmentId);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }
        return equipment;
    }

    public boolean deleteEquipment(int equipmentId){
        EntityManager em = getEm();

        try{
            Equipment equipment = findEquipment(equipmentId);

            if(equipment != null){
                em.getTransaction().begin();
                Equipment temporaryEquipment = em.merge(equipment);
                em.remove(temporaryEquipment);
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

    public ArrayList<Equipment> getAllEquipment(){
        EntityManager em = getEm();
        List<Equipment> allEquipment = null;

        try {
            Query q = em.createQuery("SELECT a FROM Equipment a");
            allEquipment = q.getResultList();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            em.close();
        }

        assert allEquipment != null;
        return new ArrayList<>(allEquipment);
    }
}
