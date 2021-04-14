package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Properties;
import javax.persistence.EntityManagerFactory;
import org.springframework.stereotype.Repository;

@Repository
public abstract class GiddRepo {
    private static EntityManagerFactory emf;

    public void connect() throws IOException {
        Properties prop = new Properties();
        HashMap<String, String> newProperties = new HashMap<>();
        //loads the local .properties file
        InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties");
        // load a properties file
        prop.load(input);
        assert input != null;
        input.close();

        newProperties.put("javax.persistence.jdbc.url", "jdbc:mysql://mysql.stud.iie.ntnu.no:3306/" + prop.getProperty("URL"));
        newProperties.put("javax.persistence.jdbc.user", prop.getProperty("spring.datasource.username"));
        newProperties.put("javax.persistence.jdbc.password", prop.getProperty("spring.datasource.password"));

        emf = javax.persistence.Persistence.createEntityManagerFactory("DatabasePU", newProperties);
    }

}
