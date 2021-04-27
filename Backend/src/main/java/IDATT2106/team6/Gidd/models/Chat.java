package IDATT2106.team6.Gidd.models;

import org.eclipse.persistence.jpa.jpql.parser.DateTime;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Entity
public class Chat {
    @Id
    @Column(name = "chat_id", unique = true)
    private Integer chatId;
    @JoinColumn(name = "group_id")
    @ManyToOne(targetEntity = Activity.class)
    private Activity activity;
    @JoinColumn(name = "user_sent_id")
    @ManyToOne(targetEntity = User.class)
    private User user;
    private String message;
    private Timestamp timeStamp;

    public Chat(Activity toActivity, User user, String message){
        this.activity = toActivity;
        this.user = user;
        this.message = message;
        this.timeStamp =  new Timestamp(new Date().getTime());
    }

    public Chat(){}

    public Integer getChatId() {
        return chatId;
    }

    public Activity getGroup() {
        return activity;
    }

    public User getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public void setGroup(Activity activity) {
        this.activity = activity;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Timestamp getTimeStamp(){
        return timeStamp;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String toString(){
        return "{" +
                "\"activity\":\"" + activity.getActivityId() + "\"" +
                ",\"user\":" + user.toJSON() +
                ",\"timestamp\":" + timeStamp.getTime() +
                ",\"message\":" + "\"" + message + "\"" +
                "}";
    }
    public String toJson(){
        return "{" +
                "\"user\":" + user.toJSON() +
                ",\"timestamp\":" + timeStamp.getTime() +
                ",\"message\":" + "\"" + message + "\"" +
                "}";
    }
}
