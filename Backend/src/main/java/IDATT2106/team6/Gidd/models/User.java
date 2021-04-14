package IDATT2106.team6.Gidd.models;

import org.eclipse.persistence.annotations.CascadeOnDelete;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    @Id
    @Column(name = "user_id")
    private int userId;
    private String email;
    private String password;
    @Column(name = "first_name")
    private String firstName;
    private String surname;
    @Column(name = "phone_number")
    private int phoneNumber;
    @Column(name = "activity_level")
    private ActivityLevel activityLevel;
    private int points;
    @Column(name = "auth_provider")
    private Provider authProvider;
    @CascadeOnDelete
    @OneToMany(mappedBy = "User")
    private List<ActivityUser> activities;

    public User(int id, String email, String password, String firstName, String surname, int phoneNumber, ActivityLevel activityLevel, int points, Provider provider){
        this.userId = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.activityLevel = activityLevel;
        this.points = points;
        this.authProvider = provider;
        this.activities = new ArrayList<ActivityUser>();
    }

    public User(){}

    public int getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getSurname() {
        return surname;
    }

    public int getPhoneNumber() {
        return phoneNumber;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public int getPoints() {
        return points;
    }

    public Provider getAuthProvider() {
        return authProvider;
    }

    public List<ActivityUser> getActivities() {
        return activities;
    }

    public void setId(int id) {
        this.userId = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPhoneNumber(int phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setAuthProvider(Provider authProvider) {
        this.authProvider = authProvider;
    }

}
