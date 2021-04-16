package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.ActivityEquipment;
import IDATT2106.team6.Gidd.models.Equipment;
import IDATT2106.team6.Gidd.repo.EquipmentRepo;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepo repo;
    private Logger log = new Logger(EquipmentService.class.toString());

    public boolean registerEquipment(String description){
        log.info("Registering equipment with description " + description);
        return this.repo.addEquipment(new Equipment(description));
    }

    public Equipment getEquipmentByDescription(String description){
        log.info("Getting equipment with description " + description);
        return this.repo.findEquipmentByDescription(description);
    }

    public boolean addActivityToEquipment(Equipment equipment, ActivityEquipment activityEquipment){
        log.info("Adding activity connection " + activityEquipment + " to equipment " + equipment.toString());
        return this.repo.addActivityToEquipment(equipment, activityEquipment);
    }
}
