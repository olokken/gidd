package IDATT2106.team6.Gidd.models;

import java.util.Arrays;
import org.eclipse.persistence.annotations.CascadeOnDelete;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Activity {
    @Id
    @Column(name = "activity_id")
    private int activityId;
    private String title;
    private Timestamp time;
    @Column(name = "days_to_repeat")
    private int daysToRepeat;
    @CascadeOnDelete
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "user_id")
    private User user;
    private int capacity;
    //Ikke laget klasse. Lar den være for nå
    @Column(name = "group_id")
    private int groupId;
    private String description;
    private byte[] image;
    @Column(name = "activity_level")
    private ActivityLevel activityLevel;
    @CascadeOnDelete
    @ManyToMany(targetEntity = Tag.class)
    private List<Tag> tags;
    @CascadeOnDelete
    @OneToMany(mappedBy = "Activity")
    private List<ActivityEquipment> equipments;
    private double latitude;
    private double longitude;
    @CascadeOnDelete
    @OneToMany(mappedBy = "Activity")
    private List<ActivityUser> registeredParticipants;
    @Column(name = "time_created")
    private Timestamp timeCreated;

    public Activity(int id, String title, Timestamp time, int repeat, User user, int capacity,
                    int groupId, String description, byte[] image, ActivityLevel activityLevel,
                    List<Tag> tags, double latitude, double longitude, Timestamp timeCreated){
        this.activityId = id;
        this.title = title;
        this.time = time;
        this.daysToRepeat = repeat;
        this.user = user;
        this.capacity = capacity;
        this.groupId = groupId;
        this.description = description;
        this.image = image;
        this.activityLevel = activityLevel;
        this.tags = tags;
        this.latitude = latitude;
        this.longitude = longitude;
        this.equipments = new ArrayList<>();
        this.registeredParticipants = new ArrayList<>();
        this.timeCreated = timeCreated;
    }

    public Activity(){}

    public int getActivityId() {
        return activityId;
    }

    public void setActivityId(int activityId) {
        this.activityId = activityId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public int getDaysToRepeat() {
        return daysToRepeat;
    }

    public void setDaysToRepeat(int daysToRepeat) {
        this.daysToRepeat = daysToRepeat;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<ActivityEquipment> getEquipments() {
        return equipments;
    }

    public void setEquipments(List<ActivityEquipment> equipments) {
        this.equipments = equipments;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public List<ActivityUser> getRegisteredParticipants() {
        return registeredParticipants;
    }

    public void setRegisteredParticipants(
        List<ActivityUser> registeredParticipants) {
        this.registeredParticipants = registeredParticipants;
    }

    public Timestamp getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Timestamp timeCreated) {
        this.timeCreated = timeCreated;
    }

    @Override
    public String toString() {
        return "Activity{" +
            "activityId=" + activityId +
            ", title='" + title + '\'' +
            ", time=" + time +
            ", daysToRepeat=" + daysToRepeat +
            ", user=" + user +
            ", capacity=" + capacity +
            ", groupId=" + groupId +
            ", description='" + description + '\'' +
            ", image=" + Arrays.toString(image) +
            ", activityLevel=" + activityLevel +
            ", tags=" + tags +
            ", equipments=" + equipments +
            ", latitude=" + latitude +
            ", longitude=" + longitude +
            ", registeredParticipants=" + registeredParticipants +
            ", timeCreated=" + timeCreated +
            '}';
    }
}
