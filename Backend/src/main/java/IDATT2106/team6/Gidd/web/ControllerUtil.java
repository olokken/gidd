package IDATT2106.team6.Gidd.web;

import IDATT2106.team6.Gidd.util.Logger;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;


public class ControllerUtil {
    private static Logger log = new Logger(ControllerUtil.class.toString());


    /**
     * Generates a random integer between 0 and max-int and returns it as a double negative
     * if the int first generated is found to be negative.
     */
    static int getRandomID() {
        log.info("creating new random id");
        int id = new Random().nextInt();
        return (id > 0 ? id : -id);
    }

    /**
     * Formats a map into a valid json-object
     *
     * @return a JSON object string
     */
    static String formatJson(Map values) {
        log.debug("formatting json");
        String result = "{";
        Iterator it = values.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            String goose = "";

            //todo very scuffed
            try {
                Integer.parseInt(pair.getValue().toString());
            } catch (Exception e) {
                goose = "\"";
            }

            result += "\"" + pair.getKey() + "\":" + goose + pair.getValue() + goose + ",\n";
            it.remove(); // avoids a ConcurrentModificationException
        }
        //remove trailing comma
        return result.substring(0, result.length() - (result.length() > 1 ? 2 : 0)) + "}";
    }

    /**
     * Iterates over a Map and checks if all values are valid.
     *
     * @param map the map being checked
     */
    static boolean validateStringMap(Map<String, Object> map) {
        log.info("validating a map");
        for (Map.Entry<String, Object> stringObjectEntry : map.entrySet()) {
            try {
                Map.Entry<String, Object> pair = (Map.Entry) stringObjectEntry;
                if (pair.getKey() == "image") {
                    break;
                }
                log.debug("Validating pair: " + pair.getKey() + ":" + pair.getValue());
                if (String.valueOf(pair.getValue()).isBlank() || pair.getValue() == null) {
                    log.error(pair.getKey() + " : " + pair.getValue() + " could not be validated");
                    return false;
                }
            } catch (Exception e) {
                log.error("An exception was caught while validating string map: " +
                    e.getMessage() + "local: " + e.getLocalizedMessage());
            }
        }
        log.info("map: " + map.toString() + " validated");
        return true;
    }

    /**
     * Checks whether or not a phoneNumber string can be parsed to a number
     */
    static boolean parsePhone(Map<String, Object> map, Map<String, String> body) {
        try {
            Integer.parseInt(map.get("phoneNumber").toString());
        } catch (NumberFormatException e) {
            log.error("phone number cannot be parsed to number " + map.toString());
            body.put("error", "phone number is not numeric");
            return false;
        } catch (Exception e) {
            log.error("An unexpected message was caught when parsing phoneNumber: " +
                e.getMessage() + " local: " + e.getLocalizedMessage());
            body.put("Error", "Something went wrong");
            return false;
        }
        return true;
    }
}
