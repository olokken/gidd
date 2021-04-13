package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import org.springframework.stereotype.Repository;

@Repository
public class MessageRepo extends GiddRepo {

    @Override
    public void connect() throws IOException {
        super.connect();
    }
}
