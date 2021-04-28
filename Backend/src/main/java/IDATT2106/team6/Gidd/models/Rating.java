package IDATT2106.team6.Gidd.models;

import org.eclipse.persistence.annotations.CascadeOnDelete;

import javax.persistence.*;

@Entity
public class Rating {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "rating_id")
    private int ratingId;
    private int rating;
    @CascadeOnDelete
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "to_user_id")
    private User toUser;
    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "from_user_id")
    private User fromUser;

    public Rating(int rating, User toUser, User fromUser){
        this.rating = rating;
        this.toUser = toUser;
        this.fromUser = fromUser;
    }

    public Rating(){}

    public int getRatingId() {
        return ratingId;
    }

    public int getRating() {
        return rating;
    }

    public User getToUser() {
        return toUser;
    }

    public void setRatingId(int ratingId) {
        this.ratingId = ratingId;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setToUser(User user) {
        this.toUser = user;
    }
}
