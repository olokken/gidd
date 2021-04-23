package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.repo.ImageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageService {
    @Autowired
    private ImageRepo repo;

    public boolean newImage(Image image) {
        return repo.addImage(image);
    }
}
