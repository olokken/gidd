package IDATT2106.team6.Gidd.web;

import static IDATT2106.team6.Gidd.web.ControllerUtil.formatJson;
import static IDATT2106.team6.Gidd.web.ControllerUtil.getRandomID;

import IDATT2106.team6.Gidd.models.Image;
import IDATT2106.team6.Gidd.models.Provider;
import IDATT2106.team6.Gidd.models.User;
import IDATT2106.team6.Gidd.service.ImageService;
import IDATT2106.team6.Gidd.service.SecurityService;
import IDATT2106.team6.Gidd.service.UserService;
import IDATT2106.team6.Gidd.util.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/login")
public class LoginController {
    private static Logger log = new Logger(LoginController.class.toString());
    @Autowired
    private UserService userService;
    @Autowired
    private SecurityService securityService;
    @Autowired
    private ImageService imageService;

    @PostMapping("")
    public ResponseEntity loginSome(@RequestBody Map<String, Object> map) {
        Map<String, String> body = new HashMap<>();

        try {
            log.info("received postmapping to /login" + map.toString());
            log.error("provider recieved: " + map.get("provider").toString());
            Provider provider = Provider.valueOf(map.get("provider").toString());
            if (provider == Provider.LOCAL) {
                return loginUser(map);
            }

            URL url;

            if (provider == Provider.FACEBOOK) {
                log.info("logging in with FACEBOOK");
                url = new URL("https://graph.facebook.com/debug_token?input_token=" +
                        map.get("accessToken").toString() +
                        "&access_token=124734739639594|mI_etwHdsRvB6s3fVf62yZQldYQ");
            } else if (provider == Provider.GOOGLE) {
                log.info("logging in with GOOGLE");
                url = new URL(
                        "https://oauth2.googleapis.com/tokeninfo?id_token=" + map.get("accessToken"));
            } else {
                body.put("error", "invalid provider provided");

                return ResponseEntity
                        .badRequest()
                        .body(formatJson(body));
            }

            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setConnectTimeout(5000);
            con.setReadTimeout(5000);

            StringBuilder content = getContent(con);

            Map resMap;
            if (provider == Provider.FACEBOOK) {
                resMap =
                        new ObjectMapper()
                                .readValue(content.substring(8, content.length() - 1), Map.class);
                if (Boolean.parseBoolean(resMap.get("is_valid").toString())) {
                    log.info("access token valid");
                    return someCheckUser(map, body, provider);

                } else {
                    body.put("error", "invalid access token");
                    return ResponseEntity
                            .badRequest()
                            .body(formatJson(body));
                }
            }
            // Provider must be GOOGLE if not FACEBOOK or LOCAL.
            // Add more if's or switch if more SoMe logins are added
            else {
                resMap = new ObjectMapper().readValue(content.toString(), Map.class);
                if (resMap.containsKey("error")) {
                    // if the map cointains "error", the token is invalid
                    body.put("error", "invalid access token");

                    return ResponseEntity
                            .badRequest()
                            .body(formatJson(body));
                }

                return someCheckUser(map, body, provider);
            }
        } catch (NullPointerException e) {
            body.put("error", "missing parameter");

            return ResponseEntity
                    .badRequest()
                    .body(formatJson(body));
        } catch (Exception e) {
            log.error("An unexpected error was caught while logging in");

            body.put("error", "something went wrong");
            return ResponseEntity
                    .unprocessableEntity()
                    .body(formatJson(body));
        }
    }

    @PostMapping("/old")
    public ResponseEntity loginUser(@RequestBody Map<String, Object> map) {
        log.info("recieved postmapping to /login " + map.toString());
        HttpHeaders header = new HttpHeaders();
        boolean result =
                userService.login(map.get("email").toString(), map.get("password").toString());
        Map<String, String> body = new HashMap<>();
        if (result) {
            log.info("logged in user with email " + map.get("email").toString());
            String id = String.valueOf(userService.getUser(map.get("email").toString()).getUserId());
            body.put("id",
                    id);
            body.put("token", String.valueOf(securityService.createToken(id, (1000 * 60 * 60 * 24))));
            header.add("Status", "200 OK");
            return ResponseEntity.ok()
                    .headers(header)
                    .body(formatJson(body));
        }
        log.error("unable to login user with email: " + map.get("email").toString());
        header.add("Status", "403 Forbidden");
        body.put("error", "unable to login user with email: " + map.get("email").toString());
        return ResponseEntity.status(403)
                .headers(header).body(formatJson(body));
    }

    private ResponseEntity someCheckUser(Map<String, Object> map,
                                         Map<String, String> body,
                                         Provider provider) throws URISyntaxException {
        User user = userService.getUser(map.get("email").toString());
        if (user != null) {
            log.info("email already found in database, generating JWT");
            body.put("token", securityService
                    .createToken(String.valueOf(user.getUserId()), (1000 * 60 * 60 * 24)));
            body.put("userId", String.valueOf(user.getUserId()));

            return ResponseEntity
                    .ok()
                    .body(formatJson(body));
        }

        log.info("email doesn't exist in database, attempting to create user");
        User newUser = userService.registerUser(
                getRandomID(),
                map.get("email").toString(),
                "9djw#ekc<_>a8ZS" + getRandomID(),
                map.get("firstName").toString(),
                map.get("surname").toString(),
                -1,
                null,
                imageService.createImage(""),
                provider);

        // TODO this segment can be removed once registerUser()
        //  makes sure the user gets a valid id
        if (newUser == null) {
            throw new NullPointerException();
        }

        body.put("token", securityService
                .createToken(String.valueOf(newUser.getUserId()), (1000 * 60 * 60 * 24)));
        body.put("userId", String.valueOf(newUser.getUserId()));

        return ResponseEntity
                .created((new URI("/user/" + newUser.getUserId())))
                .body(formatJson(body));
    }

    private StringBuilder getContent(HttpURLConnection con) throws IOException {
        int status = con.getResponseCode();
        BufferedReader in;
        if (status > 299) {
            in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        } else {
            in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        }

        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        con.disconnect();

        return content;
    }

}
