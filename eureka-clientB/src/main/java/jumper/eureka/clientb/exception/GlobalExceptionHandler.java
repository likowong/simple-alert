package jumper.eureka.clientb.exception;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 全局异常处理，由spring mvc拦截异常，做统一的处理
 */
@ControllerAdvice
public class GlobalExceptionHandler extends DefaultHandlerExceptionResolver {
    private static final Logger logger = LogManager.getLogger(GlobalExceptionHandler.class);

    /**
     * 功能描述: Ajax 请求错误拦截友好提示
     *
     * @auther: luke
     * @date: 2020/11/16 17:01
     */
    @ExceptionHandler(value = Throwable.class)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public String processUnauthenticatedException(HttpServletRequest request, HttpServletResponse response, Throwable e) {
        logger.error("地址:"+request.getRequestURI()+"发生错误,错误内容:",e);
        // 业务异常处理

        return "系统太忙,请稍后再试!";

    }
}