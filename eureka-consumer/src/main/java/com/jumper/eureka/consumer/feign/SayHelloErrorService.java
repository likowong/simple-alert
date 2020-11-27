package com.jumper.eureka.consumer.feign;

import org.springframework.stereotype.Component;

/**
 * @author luke
 * @date 2020/11/27 0027 12:57
 * @desc feign客户端
 **/
@Component
public class SayHelloErrorService implements SayHelloService {

    @Override
    public String sayHello() {
        return "被熔断了";
    }
}
