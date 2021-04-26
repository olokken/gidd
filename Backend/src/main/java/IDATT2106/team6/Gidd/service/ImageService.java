package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.repo.ImageRepo;
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
}
