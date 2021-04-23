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
    @ManyToOne(targetEntity = FriendGroup.class)
    private FriendGroup group;
    @JoinColumn(name = "user_sent_id")
    @ManyToOne(targetEntity = User.class)
    private User user;
    private String message;
    private Timestamp timeStamp;

    public Chat(FriendGroup group, User user, String message){
        this.group = group;
        this.user = user;
        this.message = message;
        this.timeStamp =  new Timestamp(new Date().getTime());
    }

    public Chat(){}

    public Integer getChatId() {
        return chatId;
    }

    public FriendGroup getGroup() {
        return group;
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

    public void setGroup(FriendGroup group) {
        this.group = group;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
