package IDATT2106.team6.Gidd.models;

public class Message {
    private int id;
    private String content;
    private int to;
    private int from;

    public Message(int id, String content, int to, int from){
        this.id = id;
        this.content = content;
        this.to = to;
        this.from = from;
    }

    public Message(){}
}
