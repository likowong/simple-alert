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
        isDisable: false,      // 店员是否被禁用
        noOrder: false,
        token: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
 
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
})