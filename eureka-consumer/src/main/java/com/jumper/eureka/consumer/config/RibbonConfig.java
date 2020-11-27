package com.jumper.eureka.consumer.config;

import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.RandomRule;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.cloud.netflix.ribbon.RibbonClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author luke
 * @date 2020/11/27 0027 14:10
 * @desc 负载均衡配置器
 **/
@Configuration
public class RibbonConfig {
    @Bean
    public IRule ribbonRule() {
        // 其中IRule就是所有规则的标准,指定随机访问
        return new RandomRule() ;
    }
}
