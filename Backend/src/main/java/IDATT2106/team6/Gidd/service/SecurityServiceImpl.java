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
    /**
     * A locally stored String that can have any value as long as it is consistent during runtime.
     * Used to encode and decode JSON Web Tokens, which are then used to authenticate users to
     * prevent "impersonation".
     */
    private static String secretKey;

    private static String setSecretKey() throws IOException {
        Properties prop = new Properties();
        InputStream input = SecurityServiceImpl.class.getClassLoader().getResourceAsStream("application.properties");
        prop.load(input);
        assert input != null;
        input.close();
        return prop.getProperty("secretKey");
    }

    static {
        try {
            secretKey = setSecretKey();
        } catch (IOException e) {
            log.error(e.toString());
        }
    }

    public String getSecretKey() {
        return secretKey;
    }

    /**
     * Creates JSON Web Tokens that are returned to users when they register or login to the site.
     * The token consists of three dot (.) separated parts. These are the header, body and signature.
     *
     *
     * @param subject userId to be encoded into the token
     * @param ttlMillis a number that decides how long the token will be valid for
     * @return a JWT string
     */
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

    /**
     * Can be used to decode a JWT to see what subject (userId) was used to encode the token.
     * This method is only used for testing purposes, and should not be included if the code is
     * to be deployed in a real life scenario.
     * This means that {@link IDATT2106.team6.Gidd.web.SecurityController#getSubject(String)}
     * should also be removed.
     *
     * @param token JWT token to be decoded
     * @return subject used when encoding the token
     */
    @Override
    public String getSubject(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(DatatypeConverter.parseBase64Binary(secretKey))
            .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
