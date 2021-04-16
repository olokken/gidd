package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Properties;
import javax.persistence.EntityManagerFactory;

import IDATT2106.team6.Gidd.util.Logger;
import org.springframework.stereotype.Repository;

@Repository
public abstract class GiddRepo {
    protected static EntityManagerFactory emf;
    private Logger log = new Logger(GiddRepo.class.toString());

    public void connect() throws IOException {
        log.debug("Connecting");
        Properties prop = new Properties();
        HashMap<String, String> newProperties = new HashMap<>();
        //loads the local .properties file
        InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties");
        // load a properties file
        prop.load(input);
        assert input != null;
        input.close();

        String jdbcUrl = "jdbc:mysql://" + prop.getProperty("RDSHOSTNAME") + ":" + prop.getProperty("RDSPORT") + "/" + prop.getProperty("RDSDBNAME");
        newProperties.put("javax.persistence.jdbc.url", jdbcUrl);
        newProperties.put("javax.persistence.jdbc.user", prop.getProperty("RDSUSERNAME"));
        newProperties.put("javax.persistence.jdbc.password", prop.getProperty("RDSPASSWORD"));
        emf = javax.persistence.Persistence.createEntityManagerFactory("DatabasePU", newProperties);
    }

}
