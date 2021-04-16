package IDATT2106.team6.Gidd.models;

import javax.persistence.*;

@Entity
@Table(name = "ACTIVITY_EQUIPMENT")
public class ActivityEquipment {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private int id;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "activityId")
    private Activity activity;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipmentId")
    private Equipment equipment;
    private int bringerId;

    public ActivityEquipment(){}

    public ActivityEquipment(Activity activity, Equipment equipment){
        this.activity = activity;
        this.equipment = equipment;
    }
}
