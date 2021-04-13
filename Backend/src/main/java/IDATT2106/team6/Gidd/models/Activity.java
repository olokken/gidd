package IDATT2106.team6.Gidd.models;

import java.sql.Timestamp;

public class Activity {
    private int id;
    private String title;
    private Timestamp time;
    private int category_id;
    private boolean repeat;
    private int user_id;
    private int capacity;
    private int group_id;
    private String description;
    private int points;
    private byte[] image;

    public Activity(int id, String title, Timestamp time, int categoryId, boolean repeat, int userId, int capacity, int groupId, String description, int points, byte[] image){
        this.id = id;
        this.title = title;
        this.time = time;
        this.category_id = categoryId;
        this.repeat = repeat;
        this.user_id = userId;
        this.capacity = capacity;
        this.group_id = groupId;
        this.description = description;
        this.points = points;
        this.image = image;
    }

    public Activity(){}
}
