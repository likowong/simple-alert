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
    var winMsg = wx.getSystemInfoSync();
    let token = wx.getStorageSync("token");
    this.setData({
      winHeight: winMsg.windowHeight,
      token: token
    });
    
    if(token){
      wxRequest.post('/app/suborderinfo/list',token)
      .then(res=>{
        let isCheck = res.data.content.isCheck;
        if(isCheck == 4){   // 店员未认证
          wx.reLaunch({  
            url: '/pages/attest/attest'
          })
        }else if(isCheck == 2 || isCheck == 3){  // 查看认证信息
          wx.setStorageSync('isCheck',isCheck)
          wx.reLaunch({
            url: '/pages/attestDetails/attestDetails'
          })
        }else{
          this.loadData(this.data.startPage,this.data.pageSize);
        }
      })
    }else{   // 没有登录情况
      wx.reLaunch({  //跳转到登录页面
        url: '/pages/login/login'
      })
    }
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
      startPage: 0,
      loadingMore: true
    })
    this.loadData(0,this.data.pageSize).then(()=>{
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();

      this.setData({
        startPage: 0
      })
      
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let startPage = this.data.startPage + this.data.pageSize;
    this.setData({
      startPage: startPage
    })
    if(this.data.loadingMore){
      this.loadData(this.data.startPage,this.data.pageSize);
    }
  },


  // 发起提单
  navigateOrderSteps() {
    if(wx.getStorageSync('activeIndex')){    // 判断是否有指示步骤的下标
      wx.removeStorageSync('activeIndex');
    }
    wx.navigateTo({
      url: '../orderSteps/orderSteps'
    })
  },

  // 加载提单列表
  loadData: function(startPage,pageSize){
    let sendData = {};
    let reqbody = {};
    let page = {};
    page.startPage = startPage;
    page.pageSize = pageSize;
    reqbody.page = page;
    sendData.reqbody = reqbody;
    sendData.serviceName = 'ApiOrderServiceImpl';
    sendData.methodName = 'listOrderInfos';
    return new Promise((resolve,reject) => {
      wxRequest.post('/api/miniProgram',sendData)
      .then(res => {
        resolve();
        if(res.data.status == 9){   // 停用状态
          this.setData({
            isDisable: true
          })
        }else{
          this.setData({
            isDisable: false
          })
          let orders = res.data.content;
          if(orders && orders.length > 0){    // 请求数据不为空
            for(let index in orders){
              let createTime = util.formatTime(orders[index].createTime);
              orders[index].createTime = createTime;
            }
            let orderMsgs = [];
            this.data.isFirstPage ? orderMsgs = orders : orderMsgs = this.data.orderMsgs.concat(orders);

            this.setData({
              noOrder: false,
              isFirstPage: false,
              orderMsgs: orderMsgs
            })
            if(orders.length < this.data.pageSize){   //当返回的数据少于每页设定加载的数量的时候，关闭下拉加载功能
              this.setData({
                loadingMore: false
              })
            }
          }else{
            this.setData({
              noOrder: true,
              loadingMore: false
            })
          }
        }
      })
    })
  },

  //跳转到提单详情页面
  navigateOrderDetails(e) {
    let orderNumber = e.currentTarget.dataset.order;
    wx.setStorageSync('orderNumber', orderNumber);
    wx.navigateTo({
      url: '../orderDetails/orderDetails'
    })
  }
})