package org.simple.alert.metadata.expand;

import org.simple.alert.metadata.RemoteAlertMetaData;

/**
 * @author luke
 * @date 2021/12/25 13:59
 * @desc 远程异常收集元数据
 **/
public class RemoteStackAlertMetaData extends RemoteAlertMetaData {
    /**
     * 堆栈信息
     */
    private Throwable throwable;

    public Throwable getThrowable() {
        return throwable;
    }

    public void setThrowable(Throwable throwable) {
        this.throwable = throwable;
    }
}
