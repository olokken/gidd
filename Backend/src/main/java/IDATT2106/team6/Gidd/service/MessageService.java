package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.repo.GiddRepo;
import IDATT2106.team6.Gidd.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    @Autowired
    private MessageRepo repo;
}
