package IDATT2106.team6.Gidd.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Group {
    @Id
    @Column(name = "group_id", unique = true)
    private Integer groupId;
    @Column(name = "group_name")
    private String groupName;
    @ManyToMany(targetEntity = User.class, fetch = FetchType.EAGER)
    private List<User> users;

    public Group(String groupName){
        this.groupName = groupName;
        this.users = new ArrayList<>();
    }

    public Group(){}

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
