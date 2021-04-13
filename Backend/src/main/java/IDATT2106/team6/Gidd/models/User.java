package IDATT2106.team6.Gidd.models;

public class User {
    private int id;
    private String email;
    private String password;
    private String first_name;
    private String surname;
    private int phone_number;
    private int activity_level;
    private Provider auth_provider;

    public User(int id, String email, String password, String firstName, String surname, int phoneNumber, int activityLevel){
        this.id = id;
        this.email = email;
        this.password = password;
        this.first_name = firstName;
        this.surname = surname;
        this.phone_number = phoneNumber;
        this.activity_level = activityLevel;
    }

    public User(){}

    public Provider getProvider() {
        return auth_provider;
    }

    public void setProvider(Provider provider) {
        this.auth_provider = provider;
    }
}
