// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        appUser: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
    // 跳转到主页
    navigateIndex() {
        if (wx.getStorageSync('activeIndex')) {    // 判断是否有指示步骤的下标
            wx.removeStorageSync('activeIndex');
        }
        wx.reLaunch({
            url: '../order/order'
        })
    },
    //跳转到提单详情页面
    navigateBaseInfo(e) {
        wx.navigateTo({
            url: '../baseinfo/baseinfo'
        })
    },
    //跳转到提单详情页面
    navigatePrice(e) {
        wx.navigateTo({
            url: '../priceSetting/priceSetting'
        })
    },
    //退出
    loginOut(e) {
        wx.removeStorageSync('token');
        wx.reLaunch({
            url: '../login/login'
        })
    }
})