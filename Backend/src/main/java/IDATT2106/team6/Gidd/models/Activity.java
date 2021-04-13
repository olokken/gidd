package IDATT2106.team6.Gidd.models;

import org.eclipse.persistence.annotations.CascadeOnDelete;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.sql.Timestamp;
import java.util.List;

@Entity
public class Activity {
    @Id
    private int id;
    private String title;
    private Timestamp time;
    private int repeat;
    private int user_id;
    private int capacity;
    private int group_id;
    private String description;
    private byte[] image;
    private ActivityLevel activity_level;
    @CascadeOnDelete
    @ManyToMany(targetEntity = Tag.class)
    private List<Tag> tags;
    private int latitude;
    private int longitude;

    public Activity(int id, String title, Timestamp time, int repeat, int userId, int capacity, int groupId, String description, int points, byte[] image, List<Tag> tags, int latitude, int longitude){
        this.id = id;
        this.title = title;
        this.time = time;
        this.repeat = repeat;
        this.user_id = userId;
        this.capacity = capacity;
        this.group_id = groupId;
        this.description = description;
        this.image = image;
        this.tags = tags;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Activity(){}

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Timestamp getTime() {
        return time;
    }

    public int getRepeat() {
        return repeat;
    }

    public int getUser_id() {
        return user_id;
    }

    public int getCapacity() {
        return capacity;
    }

    public int getGroup_id() {
        return group_id;
    }

    public String getDescription() {
        return description;
    }

    public byte[] getImage() {
        return image;
    }

    public ActivityLevel getActivity_level() {
        return activity_level;
    }

    public int getLatitude() {
        return latitude;
    }

    public int getLongitude() {
        return longitude;
    }
}
