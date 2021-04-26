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
    @JoinColumn(name = "user_id")
    private User user;

    public Rating(int rating, User user){
        this.rating = rating;
        this.user = user;
    }

    public Rating(){}

    public int getRatingId() {
        return ratingId;
    }

    public int getRating() {
        return rating;
    }

    public User getUser() {
        return user;
    }

    public void setRatingId(int ratingId) {
        this.ratingId = ratingId;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
