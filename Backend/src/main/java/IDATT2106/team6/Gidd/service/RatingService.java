package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.models.Rating;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.repo.RatingRepo;
import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {
    private Logger log = new Logger(UserService.class.toString());
    @Autowired
    private RatingRepo repo;

    public boolean addRating(int rating, User toUser, User fromUser) {
        Rating newRating = new Rating(rating, toUser, fromUser);
        return this.repo.addRating(newRating);
    }

    public double getRating(User user){
        List avg = this.repo.findAverage(user.getUserId());
        return Double.parseDouble(avg.get(0).toString());
    }

    public boolean ratingExists(User from, User to) {
        return repo.ratingExists(from.getUserId(), to.getUserId());
    }
}
