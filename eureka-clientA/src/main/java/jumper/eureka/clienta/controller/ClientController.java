package jumper.eureka.clienta.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author luke
 * @date 2020/11/27 0027 11:35
 * @desc demo
 **/
@RestController
@RequestMapping("/start")
public class ClientController {
    /**
     * @return {@link String}
     * @author luke
     * @date 11:36 2020/11/27
     * @desc url
     */
    @GetMapping("/sayHello")
    public String sayHello() throws InterruptedException {
        Thread.sleep(5000);
        return "say helloA";
    }
}
