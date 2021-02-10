// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'
import wxVaildate from '../../utils/wx_validate'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        signUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let signUrl = decodeURIComponent(options.signUrl);
        this.setData({
            signUrl: signUrl,
        })
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