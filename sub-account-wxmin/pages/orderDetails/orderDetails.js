// pages/orderDetails/orderDetails.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderNumber: '',   // 订单号
        orderInfo: {},    // 订单信息
        isUser: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderno = options.orderno;
        if (orderno) {
            this.setData({
                orderNumber: orderno
            })
            this.loadDate(orderno);
        } else {
            wx.showToast({
                icon: 'none',
                title: "订单号不存在",
            })
        }
        if (options.isUser == "true") {
            this.setData({
                isUser: true
            })
        }
    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.isUser == true) {
            wx.hideHomeButton({
                success: function () {
                    console.log(1);
                },
                fail: function () {
                    console.log(2);
                },
                complete: function () {
                    console.log(3);
                }
            });
        }
        // 获取订单信息
        this.loadDate(this.data.orderNumber)
    }, /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 获取订单信息
        this.loadDate(this.data.orderNumber)
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },

// 加载详情页的信息
    loadDate(orderno) {
        // 请求订单详情
        return new Promise((resolve) => {
            wxRequest.get('/app/suborderinfo/getOrder?orderNo=' + orderno, '', '')
                .then(res => {
                    let orderInfo = res.data.orderInfo;
                    this.setData({
                        orderInfo: orderInfo
                    })
                })
        })
    }
    ,
    // 用户点击右上角分享
    onShareAppMessage: function () {
        let orderNumber = this.data.orderNumber;
        return {
            title: "订单详情",
            path: '/pages/orderDetails/orderDetails?orderno=' + orderNumber + "&isUser=" + "true"
        }
    }
    ,
    navigateToSign(e) {
        let orderNumber = this.data.orderNumber;
        let isDBX = false
        if (this.data.orderInfo.dbxyear) {
            isDBX = true
        }
        wx.navigateTo({
            url: '../sign/sign?orderno=' + orderNumber + "&isDBX=" + isDBX
        })
    }
    ,
    navigateToPay(e) {
        let that = this;
        let orderNumber = this.data.orderNumber;
        wx.login({
            success(res) {
                if (res.code) {
                    // 统一下单
                    wxRequest.get('/app/suborderinfo/toPay?orderNo=' + orderNumber + '&code=' + res.code + '', '', '')
                        .then(res => {
                            let toPayVo = res.data.toPayVo;
                            wx.requestPayment(
                                {
                                    'appId': toPayVo.appId,
                                    'nonceStr': toPayVo.nonceStr,
                                    'package': toPayVo.prepayId,
                                    'signType': toPayVo.signType,
                                    'timeStamp': toPayVo.timeStamp,
                                    'paySign': toPayVo.paySign,
                                    'success': function (res) {
                                        wx.showToast({
                                            icon: 'none',
                                            title: "订单支付中,请稍等",
                                            duration: 3000,
                                            success: function () {
                                                setTimeout(function () {
                                                    that.queryPayStatus(orderNumber);
                                                }, 3000) //延迟时间
                                            }
                                        })
                                    },
                                    'fail': function (res) {
                                        wx.showToast({
                                            icon: 'none',
                                            title: '支付失败或取消支付',
                                        })
                                    }
                                })
                        })


                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '获取支付信息失败,请重试一下！',
                    })
                }
            }
        })
    },
    queryPayStatus(orderno) {
        wxRequest.get('/app/suborderinfo/isPay?orderNo=' + orderno, '', '')
            .then(res => {
                let isPay = res.data.isPay;
                if (isPay) {
                    wx.showToast({
                        icon: 'none',
                        title: '订单支付成功',
                    })
                    this.loadDate(orderno);
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '订单尚未支付完成,请刷新一下订单试试',
                    })
                }
            })
    }
})