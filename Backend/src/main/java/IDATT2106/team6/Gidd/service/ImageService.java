package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.repo.ImageRepo;
import java.util.Base64;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageService {
    @Autowired
    private ImageRepo repo;

    public boolean newImage(Image image) {
        return repo.addImage(image);
    }

    public boolean editImage(Image image) {
        return repo.updateImage(image);
    }

    public boolean removeImage(Image image) {
        return repo.delImage(image);
    }

    public List<Image> getAllImages() {
        return repo.getAllImages();
    }

    public Image createImage(String base) {
        Image img = new Image();
        if (base.length() > 32) {
            String[] res = splitBase(base);
            img = new Image(res[0], Base64.getDecoder().decode(res[1]));
        }
        if (newImage(img)) {
            return img;
        }
        return null;
    }

    public String[] splitBase(String base) {
        if(base.length()>32) {
            String[] res = base.split(",");
            res[0] += ",";
            return res;
        }
        return new String[]{"",""};
    }
}
