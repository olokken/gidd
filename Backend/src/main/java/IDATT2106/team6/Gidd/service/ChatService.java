package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Chat;
import IDATT2106.team6.Gidd.repo.MessageRepo;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ChatService {
    @Autowired
    private MessageRepo repo;
    private Logger log = new Logger(ChatService.class.toString());

    public boolean saveChat(Chat chat){
        return repo.saveMessage(chat);
    }

    public ArrayList<Chat> getMessages(int groupId){
        //todo check if groupId exists, return false if not
        return repo.getAllChats(groupId);
    }
}
