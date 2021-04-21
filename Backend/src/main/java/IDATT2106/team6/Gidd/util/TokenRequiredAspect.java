package IDATT2106.team6.Gidd.util;

import IDATT2106.team6.Gidd.service.SecurityServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Arrays;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class TokenRequiredAspect {

    private Logger log = new Logger(TokenRequiredAspect.class.toString());

    private final SecurityServiceImpl securityService = new SecurityServiceImpl();

    @Around("@annotation(bodyTokenRequired)")
    public Object bodyTokenRequiredWithAnnotation(ProceedingJoinPoint pjp, TokenRequired bodyTokenRequired) throws Throwable {
        String token = checkInput(pjp.getArgs());
        System.out.println(Arrays.toString(args));
        log.info("Before tokenRequiredWithAnnotation");
        ServletRequestAttributes reqAttributes =
            (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request =  reqAttributes.getRequest();
        // checks for token in request header
        String tokenInHeader = request.getHeader("token");
        if (StringUtils.isEmpty(tokenInHeader)){
            log.error("No token was passed in header");
            throw new IllegalArgumentException("Token Empty");
        }
        Claims claims = Jwts.parser()
            .setSigningKey(DatatypeConverter.parseBase64Binary(securityService.getSecretKey()))
            .parseClaimsJws(tokenInHeader).getBody();
        if(claims == null || claims.getSubject() == null) {
            log.error("Claims was found to be null");
            throw new IllegalArgumentException("Token Error: Claim is null");
        }
        if(!claims.getSubject().equalsIgnoreCase("map.get('').toString()")){
            log.error("Subject does not match token");
            throw new IllegalArgumentException("Subject doesn't match in the token");
        }
        else {
            return pjp.proceed();
        }
    }

    @Around("@annotation(pathTokenRequired)")
    public Object pathTokenRequiredWithAnnotation(ProceedingJoinPoint pjp,
                                                  PathTokenRequired pathTokenRequired) {
        return null;
    }

    private String checkInput(Object[] args) {
        Object zero = args[0];
        if(zero instanceof Map){

        }
        return null;
    }

    /*
    @Around("@annotation(tokenRequired)")
    public Object tokenRequiredWithAnnotation(ProceedingJoinPoint pjp,
                                              TokenRequired tokenRequired) throws Throwable {
        Object[] args = pjp.getArgs();
        Map<String,Object> map = (HashMap<String, Object>) args[0];
        String val = map.get("value").toString();
        System.out.println();
        ServletRequestAttributes reqAttributes =
            (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletResponse response =  reqAttributes.getResponse();
        if(val.equalsIgnoreCase("hei")){
            System.out.println("Ja!");
            response.sendError(HttpStatus.BAD_REQUEST.value(), "");
        }else{
            System.out.println("Nei!");
        }
        return null;
    }*/
}
