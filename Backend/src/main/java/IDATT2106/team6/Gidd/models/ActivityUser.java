package IDATT2106.team6.Gidd.models;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "ACTIVITY_USER")
public class ActivityUser {
    @Id
    private int id;
    @ManyToOne(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })
    @JoinColumn(name = "activity_id")
    private Activity activity;
    @ManyToOne(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })
    @JoinColumn(name = "user_id")
    private User user;
    private Timestamp reserved;

    public ActivityUser(){}

    public ActivityUser(int id, Activity activity, User user, Timestamp reserved){
        this.id = id;
        this.activity = activity;
        this.user = user;
        this.reserved = reserved;
    }

    public int getId() {
        return id;
    }

    public Activity getActivity() {
        return activity;
    }

<<<<<<< HEAD
    public Timestamp getReserved() {
        return reserved;
    }

    public User getUser() {
        return user;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public void setReserved(Timestamp reserved) {
        this.reserved = reserved;
    }

    public void setUser(User user) {
        this.user = user;
=======
    public User getUser(){
        return user;
    }

    public Timestamp getTimestamp(){
        return reserved;
>>>>>>> 1b33c8a (activity service method for signed up users)
    }
}
