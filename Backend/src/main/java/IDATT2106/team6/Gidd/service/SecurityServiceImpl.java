package IDATT2106.team6.Gidd.service;

import IDATT2106.team6.Gidd.util.Logger;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.io.IOException;
import java.io.InputStream;
import java.security.Key;
import java.util.Date;
import java.util.Properties;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import org.springframework.stereotype.Service;

@Service
public class SecurityServiceImpl implements SecurityService{

    private static Logger log = new Logger(SecurityServiceImpl.class.toString());

    private static String setSecretKey() throws IOException {
        Properties prop = new Properties();
        InputStream input = SecurityServiceImpl.class.getClassLoader().getResourceAsStream("application.properties");
        prop.load(input);
        assert input != null;
        input.close();
        return prop.getProperty("secretKey");
    }

    private static String secretKey;

    static {
        try {
            secretKey = setSecretKey();
        } catch (IOException e) {
            log.error(e.toString());
        }
    }

    @Override
    public String createToken(String subject, long ttlMillis) {
        if (ttlMillis <= 0 ) {
            throw new RuntimeException("Expiry time must be greater than zero:["+ttlMillis+"] ");
        }
        // The JWT signature algorithm we will be using to sign the token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(secretKey);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
        JwtBuilder builder = Jwts.builder()
            .setSubject(subject)
            .signWith(signatureAlgorithm, signingKey);
        long nowMillis = System.currentTimeMillis();
        builder.setExpiration(new Date(nowMillis + ttlMillis));
        log.info("JWT Token created for subject ["+subject+"]");
    return builder.compact();
    }

    @Override
    public String getSubject(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(DatatypeConverter.parseBase64Binary(secretKey))
            .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
