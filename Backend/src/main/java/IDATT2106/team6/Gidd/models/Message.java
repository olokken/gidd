package IDATT2106.team6.Gidd.models;

public class Message {

    private int user;
    private String text;

    public Message() {
    }

    public Message(Builder builder) {
        this.user = builder.user;
        this.text = builder.text;
    }

    public int getUser() {
        return user;
    }

    public String getText() {
        return text;
    }

    @Override
    public String toString() {
        return "TempChat{" +
                "user='" + user + '\'' +
                ", text='" + text + '\'' +
                '}';
    }

    public static class Builder {
        private int user;
        private String text;

        public Builder(int user, String text) {
            this.user = user;
            this.text = text;
        }

        public Message build() {
            return new Message(this);
        }
    }
}
