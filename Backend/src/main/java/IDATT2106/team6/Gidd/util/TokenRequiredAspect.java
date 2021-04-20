package IDATT2106.team6.Gidd.util;

import IDATT2106.team6.Gidd.service.SecurityService;
import IDATT2106.team6.Gidd.service.SecurityServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class TokenRequiredAspect {

    private Logger log = new Logger(TokenRequiredAspect.class.toString());

    private final SecurityServiceImpl securityService = new SecurityServiceImpl();

    /*@Before("execution (* IDATT2106.team6.Gidd.controller.GiddController.home() ) ")
    public void tokenRequiredWithoutAnnotation() throws Throwable {
        log.info("Before tokenRequiredWithExecution");
    }*/

    @Before("@annotation(tokenRequired)")
    public void tokenRequiredWithAnnotation(JoinPoint joinPoint, TokenRequired tokenRequired) throws Throwable {
        log.info("Before tokenRequiredWithAnnotation");
        ServletRequestAttributes reqAttributes =
            (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request =  reqAttributes.getRequest();
        // checks for token in request header
        String tokenInHeader = request.getHeader("token");
        if (StringUtils.isEmpty(tokenInHeader)){
            log.error("No token was passed in header");
            throw new IllegalArgumentException("Empty token");
        }
        Claims claims = Jwts.parser()
            .setSigningKey(DatatypeConverter.parseBase64Binary(securityService.getSecretKey()))
            .parseClaimsJws(tokenInHeader).getBody();
        if(claims == null || claims.getSubject() == null) {
            log.error("Claims was found to be null");
            throw new IllegalArgumentException("Token Error: Claim is null");
        }
        if(!claims.getSubject().equalsIgnoreCase(joinPoint.getArgs()[0].toString())){
            log.error("Subject does not match token");
            throw new IllegalArgumentException("Subject doesn't match in the token");
        }
    }
}
