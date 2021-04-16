package IDATT2106.team6.Gidd.util;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.io.FileWriter;
import java.io.BufferedWriter;

public class Logger {
    private File log = new File("logs/log.txt");
    private String className;
    private FileWriter fw;
    private BufferedWriter bw;

    public Logger(String className){
        this.className = className;
    }

    public void info(String msg){
        write("INFO: " + msg, true);
    }
    public void debug(String msg){
        write("INFO: " + msg, false);
    }
    public void error(String msg){
        write("INFO: " + msg, true);
    }
    private void write(String msg, boolean print){
        try{
            fw = new FileWriter(log, StandardCharsets.UTF_8, true);
            bw = new BufferedWriter(fw);

            String output = java.time.LocalDateTime.now().toString() + " " + className + " " + msg;
            if(print){
                System.out.println(output);
            }
            bw.write(output + "\n");
            bw.close();
        } catch(Exception e){
            e.printStackTrace();
        }
    }
}
