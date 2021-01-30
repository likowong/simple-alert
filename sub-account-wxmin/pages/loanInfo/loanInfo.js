// pages/loanInfo/loanInfo.js
import wxRequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: '',   // 订单号
    orderMsg: {},    // 提单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderNumber = wx.getStorageSync('orderNumber');
    this.setData({
      orderNumber: orderNumber 
    })

    let sendData = {};
    let reqbody = {};
    let paramsMap = {};
    paramsMap.orderNumber = this.data.orderNumber;
    reqbody.paramsMap = paramsMap;
    sendData.reqbody = reqbody;
    sendData.serviceName = "ApiOrderServiceImpl";
    sendData.methodName = "getOrderNumberInfoOfSell";

    // 请求订单详情
    wxRequest.post('/api/miniProgram',sendData)
    .then(res => {
      let orderMsg = res.data.content;
      this.setData({
        orderMsg: orderMsg
      })
    })
  }
})