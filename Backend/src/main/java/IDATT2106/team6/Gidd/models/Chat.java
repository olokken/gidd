package IDATT2106.team6.Gidd.models;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
        List<User> registeredUsers = toActivity.getRegisteredParticipants().stream().map(ActivityUser::getUser).collect(Collectors.toList());

        if(registeredUsers.contains(user)) {
            this.activity = toActivity;
            this.user = user;
            this.message = message;
            this.timeStamp = new Timestamp(new Date().getTime());
        }
        else {
            throw new IllegalArgumentException("user does not belong to that activity");
        }
    }

    public Chat(){}

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Timestamp getTimeStamp(){
        return timeStamp;
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
