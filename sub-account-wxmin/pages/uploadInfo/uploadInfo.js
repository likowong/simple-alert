// pages/uploadInfo/uploadInfo.js
import wxRequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: '',   // 订单号
    carContractUrl: [],    // 订单合同
    successReplyUrl: []    // 批复函
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
      let carContractUrl = JSON.parse(orderMsg.carContractUrl);
      let successReplyUrl = JSON.parse(orderMsg.successReplyUrl);
      console.log(carContractUrl);
      this.setData({
        carContractUrl: carContractUrl,
        successReplyUrl: successReplyUrl
      })
    })
  },

  // 查看图片
  previewImage(e) {
    let current = e.target.dataset.src;
    let imgs = e.target.dataset.imgs;
    let newImgs = [];
    imgs.forEach(function(item){
      newImgs.push(item.url);
    })
    wx.previewImage({
      urls: newImgs, // 需要预览的图片http链接列表
      current: current
    })
  },
})