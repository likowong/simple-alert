// pages/orderDetails/orderDetails.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',        // 店员手机号
    orderNumber: '',   // 订单号
    orderMsg: {},    // 订单信息
    orderProcess: [],    // 订单进程
    currentStatus: ''     // 当前订单进程的状态码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = wx.getStorageSync("phone");
    let orderNumber = wx.getStorageSync('orderNumber');
    this.setData({
      phone: phone,
      orderNumber: orderNumber 
    })
    this.loadDate();
    this.loadProcess();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.loadDate().then( () => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadDate();
  },

  // 加载详情页的信息
  loadDate() {
    let sendData = {};
    let reqbody = {};
    let paramsMap = {};
    paramsMap.orderNumber = this.data.orderNumber;
    reqbody.paramsMap = paramsMap;
    sendData.reqbody = reqbody;
    sendData.serviceName = "ApiOrderServiceImpl";
    sendData.methodName = "getOrderNumberInfoOfSell";

    // 请求订单详情
    return new Promise((resolve) => {
      wxRequest.post('/api/miniProgram',sendData)
      .then(res => {
        let order = res.data.content;
        let createDate = util.formatTime(order.createTime);
        order.createDate = createDate;
        // let expireDate = util.downTime(order.orderExpireTime);
        // order.expireDate = expireDate;
        this.setData({
          orderMsg: order
        })
        resolve();
      })
    })
  },

  // 加载订单进程
  loadProcess() {
    let sendData = {};
    let reqbody = {};
    let paramsMap = {};
    paramsMap.orderNumber = this.data.orderNumber;
    reqbody.paramsMap = paramsMap;
    sendData.reqbody = reqbody;
    sendData.serviceName = "ApiOrderServiceImpl";
    sendData.methodName = "getOrderMessage";

    // 请求订单详情
    wxRequest.post('/api/miniProgram',sendData)
    .then(res => {
      console.log(res);
      let orderProcess = res.data.content;
      // let createTime = util.downTime(orderProcess.createTime);
      // orderProcess.createTime = createTime;
      for(let index in orderProcess){
        let createDate = util.formatTime(orderProcess[index].createTime);
        let expireDate = util.downTime(orderProcess[index].orderExpireTime);
        orderProcess[index].createDate = createDate;
        orderProcess[index].expireDate = expireDate;
      }
      
      let currentStatus;
      if(orderProcess.length > 0){
        currentStatus = orderProcess[0].workCode;
      }

      this.setData({
        orderProcess: orderProcess,
        currentStatus: currentStatus
      })
    })
    
  },

  // 未授权状态下查看授权二维码
  viewCode: function(){
    console.log("123");
    let phone = this.data.phone;
    let orderNumber = this.data.orderNumber;
    let orderMsg = {
      phone: phone,
      orderNumber: orderNumber
    }
    orderMsg = JSON.stringify(orderMsg);
    console.log(orderMsg);
    let h5BaseUrl = wxRequest._h5BaseUrl;
    let baseUrl = wxRequest._baseUrl;
    let token = wxRequest._token.replace(/[\r\n]/g,"");
    let codeBaseUrl = baseUrl+'/common/getQrCode'+'?token='+token;
    let codeReqUrl = h5BaseUrl + '?orderMsg='+ encodeURI(orderMsg);
    
    let codeWidth = 300;
    let codeHeight = 300;
    let codeUrl = codeBaseUrl + '&txt=' + codeReqUrl + '&width=' + codeWidth + '&height=' + codeHeight;
    wx.setStorageSync('codeUrl', codeUrl);

    wx.navigateTo({
      url: '../code/code'
    })
  },

  // 拨打电话
  callPhone(){
    wx.makePhoneCall({
        phoneNumber: '0755-86955827'
    })
  },

  // 跳转到车贷资料页面
  toLoanInfo(){
    wx.navigateTo({
      url: '../loanInfo/loanInfo'
    })
  },

  // 跳转到上传资料页面
  toUploadInfo(){
    wx.navigateTo({
      url: '../uploadInfo/uploadInfo'
    })
  }
})