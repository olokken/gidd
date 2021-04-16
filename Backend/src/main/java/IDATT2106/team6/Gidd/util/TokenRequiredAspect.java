package IDATT2106.team6.Gidd.util;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TokenRequiredAspect {

    private Logger log = new Logger(TokenRequiredAspect.class.toString());

    @Before("execution (* IDATT2106.team6.Gidd.controller.GiddController.home() ) ")
    public void tokenRequiredWithoutAnnotation() throws Throwable {
        log.info("Before tokenRequiredWithExecution");
    }

    @Before("@annotation(tokenRequired)")
    public void tokenRequiredWithAnnotation(TokenRequired tokenRequired) throws Throwable {
        log.info("Before tokenRequiredWithAnnotation");
    }
}
