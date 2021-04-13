package IDATT2106.team6.Gidd.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Tag {
    @Id
    private int id;
    private String description;

    public Tag(int id, String description){
        this.id = id;
        this.description = description;
    }

    public Tag(){}

    public int getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

