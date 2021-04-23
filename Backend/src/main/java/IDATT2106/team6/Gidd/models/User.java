package IDATT2106.team6.Gidd.models;

import org.eclipse.persistence.annotations.CascadeOnDelete;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;


import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

@Entity
public class User {
    @Id
    @Column(name = "user_id")
    private int userId;
    @Column(unique = true)
    private String email;
    private String password;
    @Column(name = "first_name")
    private String firstName;
    private String surname;
    @Column(name = "phone_number")
    private int phoneNumber;
    @Column(name = "activity_level")
    private ActivityLevel activityLevel;
    private int points;
    @Column(name = "auth_provider")
    private Provider authProvider;
    @CascadeOnDelete
    @OneToMany(mappedBy = "User", fetch = FetchType.EAGER)
    private List<ActivityUser> activities;
    private String salt;
    @CascadeOnDelete
    @ManyToMany(targetEntity = User.class, fetch = FetchType.EAGER)
    private List<User> friendList;

    public User(int id, String email, String password,
                String firstName, String surname,
                int phoneNumber, ActivityLevel activityLevel, Provider provider){
        this.userId = id;
        this.email = email;
        this.firstName = firstName;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.activityLevel = activityLevel;
        this.authProvider = provider;
        this.activities = new ArrayList<ActivityUser>();
        this.points = 0;

        //generates random salt
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);

        //convert password to char arra
        char[] passwordChars = password.toCharArray();
        //password hashed with salt
        byte[] hashedBytes = hashPassword(passwordChars, salt);

        //convert hashed password to string to store in datbase
        String hashedString = Hex.encodeHexString(hashedBytes);
        //convert byte to string
        this.salt = org.apache.commons.codec.binary.Base64.encodeBase64String(salt);
        this.password = hashedString;

        this.friendList = new ArrayList<>();
    }

    private byte[] hashPassword(final char[] password, final byte[] salt) {
        //high iterations slows down algorithm
        int iterations = 10000;
        int keyLength = 512;

        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");
            //encodes password
            PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
            SecretKey key = skf.generateSecret(spec);
            return key.getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalArgumentException(e);
        }
    }

    public boolean verifyPassword(String testPassword) {
        //the password that is to be tested
        System.out.println("passordet er " + testPassword);
        if (testPassword == null) return false;
        char[] passwordChars = testPassword.toCharArray();
        byte[] saltBytes = Base64.decodeBase64(salt);
        byte[] hashedBytes = hashPassword(passwordChars, saltBytes);
        String hashedString = Hex.encodeHexString(hashedBytes);
        return (hashedString.equals(password));
    }



    public User(){}

    public int getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getSurname() {
        return surname;
    }

    public int getPhoneNumber() {
        return phoneNumber;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public int getPoints() {
        return points;
    }

    public Provider getAuthProvider() {
        return authProvider;
    }

    public List<ActivityUser> getActivities() {
        return activities;
    }

    public String getSalt() {
        return salt;
    }

    public List<User> getFriendList() {
        return friendList;
    }

    public void setId(int id) {
        this.userId = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setPhoneNumber(int phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setAuthProvider(Provider authProvider) {
        this.authProvider = authProvider;
    }

    public void addActivity(ActivityUser activityUser){
        this.activities.add(activityUser);
    }

    public void setActivities(List<ActivityUser> activities) {
        this.activities = activities;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public void setFriendList(List<User> friendList) {
        this.friendList = friendList;
    }

    public void addFriend(User user) {
        this.friendList.add(user);
    }

    public String toJSON() {
        return "\n  {" +
            "\n     \"userId\":" + userId + "," +
            "\n     \"email\":" + '\"' + email + '\"' +"," +
            "\n     \"firstName\":" + '\"' + firstName + '\"' +"," +
            "\n     \"surname\":" + '\"' + surname + '\"' +"," +
            "\n     \"phoneNumber\":" + phoneNumber +"," +
            "\n     \"activityLevel\":" + '\"' + activityLevel + '\"' +"," +
            "\n     \"points\":" + points +
            "\n }";
    }

    public String toString() {
        return "\n  {" +
                "\n     \"userId\":" + userId + "," +
                "\n     \"email\":" + '\"' + email + '\"' +"," +
                "\n     \"firstName\":" + '\"' + firstName + '\"' +"," +
                "\n     \"surname\":" + '\"' + surname + '\"' +"," +
                "\n     \"phoneNumber\":" + phoneNumber +"," +
                "\n     \"activityLevel\":" + '\"' + activityLevel + '\"' + "," +
                "\n     \"points\":" + points + "," +
                "\n     \"provider\":" + '\"' + authProvider + '\"' +
                "\n }";
    }
}
