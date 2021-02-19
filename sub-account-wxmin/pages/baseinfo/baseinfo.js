// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        appUser: '',
        winHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let winMsg = wx.getSystemInfoSync();
        this.setData({
            winHeight: winMsg.windowHeight
        });
        let token = wx.getStorageSync("token");
        if (token) {
            wxRequest.post('/app/getUser', "", token)
                .then(res => {
                    this.setData({
                        appUser: res.data.appUser
                    })
                })
        } else {   // 没有登录情况
            wx.reLaunch({  //跳转到登录页面
                url: '/pages/login/login'
            })
        }
    },
})