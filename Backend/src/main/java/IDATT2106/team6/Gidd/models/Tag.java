package IDATT2106.team6.Gidd.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Tag {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private int tagId;
    private String description;

    public Tag(int id, String description){
        this.tagId = id;
        this.description = description;
    }

    public Tag(){}

    public int getTagId() {
        return tagId;
    }

    public String getDescription() {
        return description;
    }

    public void setTagId(int tagId) {
        this.tagId = tagId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "\""+description+"\"";
    }
}

