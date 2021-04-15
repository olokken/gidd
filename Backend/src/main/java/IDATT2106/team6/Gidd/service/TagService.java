package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Tag;
import IDATT2106.team6.Gidd.repo.TagRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TagService {
    @Autowired
    private TagRepo repo;

    public void addTag(Tag tag) {
        repo.addTag(tag);
    }

    public Tag getTag(int id){
        return repo.findTag(id);
    }

    public Tag getTag(String desc) {
        return repo.findTag(desc.trim());
    }
}
