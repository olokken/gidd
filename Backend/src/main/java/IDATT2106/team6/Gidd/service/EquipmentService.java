package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Equipment;
import IDATT2106.team6.Gidd.repo.EquipmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepo repo;

    public boolean registerEquipment(String description){
        return this.repo.addEquipment(new Equipment(description));
    }
}
