package com.jumper.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * @author luke
 * @Date 2020-11-26
 */
@EnableEurekaServer
@SpringBootApplication
public class JumperEurekaApplication {

    public static void main(String[] args) {
        SpringApplication.run(JumperEurekaApplication.class, args);
    }

}
