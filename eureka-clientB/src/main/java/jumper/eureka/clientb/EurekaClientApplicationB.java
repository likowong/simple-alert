package jumper.eureka.clientb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * @author luke
 */
@EnableEurekaClient
@SpringBootApplication
public class EurekaClientApplicationB {

    public static void main(String[] args) {
        SpringApplication.run(EurekaClientApplicationB.class, args);
    }

}
