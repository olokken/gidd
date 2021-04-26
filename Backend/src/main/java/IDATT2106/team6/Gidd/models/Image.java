package IDATT2106.team6.Gidd.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private int imageId;
    private String datatype;
    @Column(name = "image")
    private byte[] imageBytes;

    public Image(String dataType, byte[] imageBytes){
        this.imageId = -1;
        this.datatype = dataType;
        this.imageBytes = imageBytes;
    }

    public Image(){
        this.imageId = -1;
        this.datatype = "";
        this.imageBytes = new byte[]{};
    }

    public int getId() {
        return imageId;
    }

    public String getDatatype() {
        return datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public byte[] getBytes() {
        return imageBytes;
    }

    public void setBytes(byte[] imageBytes) {
        this.imageBytes = imageBytes;
    }
}
