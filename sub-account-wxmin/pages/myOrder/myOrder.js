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
        startPage: 1,    //请求第几页
        pageSize: 5,     //每页显示的数量
        loadingMore: true,    //下拉的时候是否请求接口
        noOrder: false,
        token: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var winMsg = wx.getSystemInfoSync();
        let token = wx.getStorageSync("token");
        this.setData({
            winHeight: winMsg.windowHeight
        });
        // 获取订单信息
        let url = '/app/suborderinfo/list?limit=' + this.data.pageSize + '&page=1'
        wxRequest.post(url, "", token)
            .then(res => {
                this.setData({
                    orderMsgs: res.data.page.list
                })
            })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.setData({
            orderMsgs: [],
            isFirstPage: true,
            loadingMore: true,
            startPage: 1
        })
        this.loadData(1, this.data.pageSize).then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let startPage = this.data.startPage + 1;
        this.setData({
            startPage: startPage
        })
        if (this.data.loadingMore) {
            this.loadData(this.data.startPage, this.data.pageSize);
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
    // 跳转我的
    navigateMine() {
        if (wx.getStorageSync('activeIndex')) {    // 判断是否有指示步骤的下标
            wx.removeStorageSync('activeIndex');
        }
        wx.reLaunch({
            url: '../mine/mine'
        })
    },

    // 加载提单列表
    loadData: function (startPage, pageSize) {
        let token = wx.getStorageSync("token");
        var url = '/app/suborderinfo/list?limit=' + pageSize + "&page=" + startPage
        return new Promise((resolve, reject) => {
            wxRequest.post(url, '', token)
                .then(res => {
                    resolve();
                    this.setData({
                        isDisable: false
                    })
                    let orders = res.data.page.list;
                    if (orders && orders.length > 0) {    // 请求数据不为空
                        let orderMsgs = this.data.orderMsgs.concat(orders);
                        this.setData({
                            noOrder: false,
                            isFirstPage: false,
                            orderMsgs: orderMsgs
                        })
                        if (orders.length < this.data.pageSize) {   //当返回的数据少于每页设定加载的数量的时候，关闭下拉加载功能
                            this.setData({
                                loadingMore: false
                            })
                        }
                    } else {
                        this.setData({
                            noOrder: true,
                            loadingMore: false
                        })
                    }
                })
        })
    },    //跳转到提单详情页面
    navigateOrderDetails(e) {
        let orderno = e.currentTarget.dataset.orderno;
        wx.navigateTo({
            url: '../orderDetails/orderDetails?orderno=' + orderno
        })
    }
})