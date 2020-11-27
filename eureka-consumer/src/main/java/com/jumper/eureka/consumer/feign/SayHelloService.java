package com.jumper.eureka.consumer.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author luke
 * @date 2020/11/27 0027 12:57
 * @desc feign客户端
 **/
@FeignClient(value = "eureka-client",fallback = SayHelloErrorService.class)
public interface SayHelloService {
    /**
     * @author luke
     * @date 15:15 2020/11/27 0027
     * @desc feign调用
     * @Param null
     * @return [String]
     */
    @RequestMapping("/start/sayHello")
    String sayHello();
}
