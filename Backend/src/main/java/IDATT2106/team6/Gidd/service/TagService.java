package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.repo.TagRepo;
import IDATT2106.team6.Gidd.util.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TagService {
    private Logger log = new Logger(TagService.class.toString());
    @Autowired
    private TagRepo repo;

    public void addTag(Tag tag) {
        log.info("adding tag to repo" + tag.toString());
        repo.addTag(tag);
    }

    public Tag getTag(int id){
        log.info("getting tag with id " + id);
        return repo.findTag(id);
    }

    public Tag getTag(String desc) {
        log.info("getting tag with description " + desc);
        return repo.findTag(desc.trim());
    }

    public List<Tag> getAllTags() {
        return repo.getAllTags();
    }
}
