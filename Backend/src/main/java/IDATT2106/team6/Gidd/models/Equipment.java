package IDATT2106.team6.Gidd.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Equipment {
    @Id
    @Column(name = "equipment_id")
    private int equipmentId;
    private String description;
    @OneToMany(mappedBy = "Equipment")
    private List<ActivityEquipment> activities;

    public Equipment(int equipmentId, String description){
        this.equipmentId = equipmentId;
        this.description = description;
    }

    public Equipment(){}

    public int getEquipmentId() {
        return equipmentId;
    }

    public String getDescription() {
        return description;
    }

    public void setEquipmentId(int equipmentId) {
        this.equipmentId = equipmentId;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}