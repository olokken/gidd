package IDATT2106.team6.Gidd.repo;

import java.io.IOException;
import org.springframework.stereotype.Repository;
import IDATT2106.team6.Gidd.util.*;
@Repository
public class MessageRepo extends GiddRepo {
    private Logger log = new Logger(MessageRepo.class.toString());
    @Override
    public void connect() throws IOException {
        super.connect();
    }
}
