package IDATT2106.team6.Gidd.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "FRIEND_GROUP")
public class FriendGroup {
    @Id
    @Column(name = "group_id")
    private Integer groupId;
    @Column(name = "group_name")
    private String groupName;
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "owner_id")
    private User owner;
    @ManyToMany(targetEntity = User.class, fetch = FetchType.EAGER)
    private List<User> users;

    public FriendGroup(int groupId, String groupName, User owner){
        this.groupId = groupId;
        this.groupName = groupName;
        this.owner = owner;
        this.users = new ArrayList<>();
    }

    public FriendGroup(){
        this.users = new ArrayList<>();
    }

    public Integer getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public List<User> getUsers() {
        return users;
    }

    public User getOwner() {
        return owner;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void addUser(User user){
        this.users.add(user);
    }

    public void removeUser(User user) {
        users.removeIf(u -> u.getUserId() == user.getUserId());
    }

    @Override
    public String toString() {
        return "{" +
                "\"groupId\":\"" + groupId + "\"," +
                "\"groupName\":\"" + groupName + "\"," +
                "\"users\":" + users.toString() + "," +
                "\"owner\":" + owner.toString() +
                '}';
    }
}
