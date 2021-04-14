package IDATT2106.team6.Gidd.models;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "ACTIVITY_USER")
public class ActivityUser {
    @Id
    private int id;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "activityId")
    private Activity activity;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    private User user;
    private Timestamp reserved;

    public ActivityUser(){}
}
