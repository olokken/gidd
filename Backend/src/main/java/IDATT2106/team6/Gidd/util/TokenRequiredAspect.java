package IDATT2106.team6.Gidd.util;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TokenRequiredAspect {
    @Before("execution (* IDATT2106.team6.Gidd.controller.GiddController.home() ) ")
    public void tokenRequiredWithoutAnnotation() throws Throwable {
        System.out.println("Before tokenRequiredWithExecution");
    }

    @Before("@annotation(tokenRequired)")
    public void tokenRequiredWithAnnotation(TokenRequired tokenRequired) throws Throwable {
        System.out.println("Before tokenRequiredWithAnnotation");
    }
}
