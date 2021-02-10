// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        winHeight: 0,  //窗口高度
        orderMsgs: [],   // 渲染的列表数据
        isFirstPage: true,    // orderMsgs是否为空
        startPage: 0,    //请求第几页
        pageSize: 10,     //每页显示的数量
        loadingMore: true,    //下拉的时候是否请求接口
        noOrder: false,
        token: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //如果不存在token
        if (!wx.getStorageSync("token")) {
            wx.reLaunch({  //跳转到登录页面
                url: '/pages/login/login'
            })
        } else {
            let winMsg = wx.getSystemInfoSync();
            let token = wx.getStorageSync("token");
            this.setData({
                winHeight: winMsg.windowHeight
            });
            // 获取订单信息
            let url = '/app/suborderinfo/list?limit=3&page=1'
            wxRequest.post(url, "", token)
                .then(res => {
                    this.setData({
                        orderMsgs: res.data.page.list
                    })
                })
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

        //如果不存在token
        if (!wx.getStorageSync("token")) {
            wx.reLaunch({  //跳转到登录页面
                url: '/pages/login/login'
            })
        } else {
            // 显示顶部刷新图标
            wx.showNavigationBarLoading();
            var winMsg = wx.getSystemInfoSync();
            let token = wx.getStorageSync("token");
            this.setData({
                winHeight: winMsg.windowHeight
            });
            // 获取订单信息
            let url = '/app/suborderinfo/list?limit=3&page=1'
            wxRequest.post(url, "", token)
                .then(res => {
                    this.setData({
                        orderMsgs: res.data.page.list
                    })
                })
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        }
    },
    // 发起提单
    navigateAddOrder() {
        wx.navigateTo({
            url: '../sendOrder/sendOrder'
        })
    },

    // 跳转我的
    navigateMine() {
        if (wx.getStorageSync('activeIndex')) {    // 判断是否有指示步骤的下标
            wx.removeStorageSync('activeIndex');
        }
        wx.reLaunch({
            url: '../mine/mine'
        })
    },
    //跳转到提单详情页面
    navigateOrderDetails(e) {
        let orderno = e.currentTarget.dataset.orderno;
        wx.navigateTo({
            url: '../orderDetails/orderDetails?orderno=' + orderno
        })
    },
    navigatePriceSetting(e) {
        wx.navigateTo({
            url: '../priceSetting/priceSetting'
        })
    },
    myOrderList(e) {
        wx.navigateTo({
            url: '../myOrder/myOrder'
        })
    }
})