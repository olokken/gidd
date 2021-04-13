package IDATT2106.team6.Gidd.models;

import org.eclipse.persistence.annotations.CascadeOnDelete;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.List;

@Entity
public class User {
    @Id
    private int id;
    private String email;
    private String password;
    private String first_name;
    private String surname;
    private int phone_number;
    private ActivityLevel activity_level;
    private int points;
    private Provider auth_provider;
    @CascadeOnDelete
    @ManyToMany(targetEntity = Activity.class)
    private List<Activity> activities;

    public User(int id, String email, String password, String firstName, String surname, int phoneNumber, ActivityLevel activityLevel, int points, List<Activity> activities){
        this.id = id;
        this.email = email;
        this.password = password;
        this.first_name = firstName;
        this.surname = surname;
        this.phone_number = phoneNumber;
        this.activity_level = activityLevel;
        this.points = points;
        this.activities = activities;
    }

    public User(){}

    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getSurname() {
        return surname;
    }

    public int getPhone_number() {
        return phone_number;
    }

    public ActivityLevel getActivity_level() {
        return activity_level;
    }

    public int getPoints() {
        return points;
    }

    public Provider getAuth_provider() {
        return auth_provider;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPhone_number(int phone_number) {
        this.phone_number = phone_number;
    }

    public void setActivity_level(ActivityLevel activity_level) {
        this.activity_level = activity_level;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setAuth_provider(Provider auth_provider) {
        this.auth_provider = auth_provider;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
}
