package jumper.eureka.clientb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * @author luke
 */
@EnableEurekaClient
@SpringBootApplication
public class EurekaClientApplicationA {

    public static void main(String[] args) {
        SpringApplication.run(EurekaClientApplicationA.class, args);
    }

}
