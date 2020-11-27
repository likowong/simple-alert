package com.jumper.eureka.consumer.controller;

import com.jumper.eureka.consumer.feign.SayHelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * @author luke
 * @date 2020/11/27 0027 11:35
 * @desc demo
 **/
@RestController
@RequestMapping("/start")
public class ClientController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private SayHelloService sayHelloService;
    /**
     * 实例化RestTemplate
     *
     * @return
     */
    @LoadBalanced
    @Bean
    public RestTemplate rest() {
        return new RestTemplate();
    }

    /**
     * @return {@link String}
     * @author luke
     * @date 11:36 2020/11/27
     * @desc url
     */
    @GetMapping("/sayHello")
    public String sayHello() {
        return restTemplate.getForObject("http://eureka-client/start/sayHello", String.class);
    }

    /**
     * @return {@link String}
     * @author luke
     * @date 11:36 2020/11/27
     * @desc url
     */
    @GetMapping("/feignSayHello")
    public String feignSayHello() {
        return sayHelloService.sayHello();
    }
}
