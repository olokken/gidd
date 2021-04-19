package IDATT2106.team6.Gidd.service;

import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.lenient;
import static org.junit.jupiter.api.Assertions.*;

import IDATT2106.team6.Gidd.repo.*;
import IDATT2106.team6.Gidd.service.*;
import IDATT2106.team6.Gidd.models.*;
import IDATT2106.team6.Gidd.util.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {
    @InjectMocks
    private TagService service;

    @Mock
    private TagRepo repo;

    @BeforeEach
    public void setUp(){
        
    }

}
