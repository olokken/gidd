package IDATT2106.team6.Gidd.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ActivityGroup {
    @Id
    @Column(name = "group_id")
    private Integer groupId;
    @Column(name = "group_name")
    private String groupName;
    @OneToOne(targetEntity = User.class)
    @JoinColumn(name = "owner_id")
    private User owner;
    @ManyToMany(targetEntity = User.class, fetch = FetchType.EAGER)
    private List<User> users;

    public ActivityGroup(String groupName){
        this.groupName = groupName;
        this.users = new ArrayList<>();
    }

    public ActivityGroup(){}

    public Integer getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public List<User> getUsers() {
        return users;
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

    public void addUser(User user){
        this.users.add(user);
    }
}
