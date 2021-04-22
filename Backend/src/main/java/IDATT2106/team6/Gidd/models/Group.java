package IDATT2106.team6.Gidd.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Group {
    @Id
    @Column(name = "group_id", unique = true)
    private Integer groupId;
    @Column(name = "group_name")
    private String groupName;

    public Group(String groupName){
        this.groupName = groupName;
    }

    public Group(){}

    public Integer getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
}
