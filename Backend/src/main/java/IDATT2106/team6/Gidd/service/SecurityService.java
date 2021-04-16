package IDATT2106.team6.Gidd.service;

import org.springframework.stereotype.Service;

@Service
public interface SecurityService {
    String createToken(String subject, long ttlMillis);
}
