package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Activity;
import IDATT2106.team6.Gidd.models.FriendGroup;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.FriendGroupRepo;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FriendGroupService {

    private Logger log = new Logger(FriendGroupService.class.toString());
    @Autowired
    private FriendGroupRepo repo;

    public boolean addFriendGroup(int groupId, String groupName, ArrayList<User> users, User owner) {
        FriendGroup friendGroup = new FriendGroup(groupId, groupName, owner);
        for(User u : users){
            friendGroup.addUser(u);
        }
        return this.repo.addFriendGroup(friendGroup);
    }

    public List<FriendGroup> getAllFriendGroups(){
        return this.repo.getAllFriendGroups();
    }

    public FriendGroup getFriendGroup(int friendGroupId) {
        return this.repo.findFriendGroup(friendGroupId);
    }

    public boolean deleteFriendGroup(int friendGroupId) {
        return this.repo.deleteFriendGroup(friendGroupId);
    }

    public boolean addUserToFriendGroup(FriendGroup friendGroup, User user) {
        friendGroup.addUser(user);
        return repo.updateFriendGroup(friendGroup);
    }

    public boolean removeUserFromFriendGroup(FriendGroup friendGroup, User user) {
        friendGroup.removeUser(user);
        return repo.updateFriendGroup(friendGroup);
    }

    public boolean updateOwner(FriendGroup friendGroup, User user){
        friendGroup.setOwner(user);
        return repo.updateFriendGroup(friendGroup);
    }

    public List<Activity> getActivitiesForGroup(FriendGroup friendGroup){
        return repo.getActivitiesForGroup(friendGroup.getGroupId());
    }
}
