package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.service.ImageService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/image")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @GetMapping(value = "")
    public ResponseEntity getImages() {
        List<Image> images = imageService.getAllImages();

        return ResponseEntity
            .ok()
            .body(images);
    }
}
