package IDATT2106.team6.Gidd.models;

public class Chat {
    private int id;
    private int group_id;
    private int user_id;

    public Chat(int id, int group_id, int user_id){
        this.id = id;
        this.group_id = group_id;
        this.user_id = user_id;
    }

    public Chat(){}
}
