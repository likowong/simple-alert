// pages/attestDetails/attestDetails.js
import wxRequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,  //窗口高度
    token: '',
    isCheck: '3',
    orderMsg: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let winMsg = wx.getSystemInfoSync();
    let token = wx.getStorageSync('token');
    this.setData({
      winHeight: winMsg.windowHeight,
      token: token
    });
    
    wxRequest.post('/sell/getSell',token).then(res => {
      let isCheck = res.data.content.isCheck;
      let orderMsg = res.data.content;
      this.setData({
        isCheck: isCheck,
        orderMsg: orderMsg
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    wxRequest.post('/sell/getSell',this.data.token).then(res => {
      let isCheck = res.data.content.isCheck;
      this.setData({
        isCheck: isCheck
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      if(isCheck == '1'){
        wx.reLaunch({  
          url: '/pages/order/order'
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 跳转到店员认证页面
  attestClerk: function(){
    wx.navigateTo({
      url: '../clerk/clerk'
    })
  },
  // 拨打电话
  callPhone(){
    wx.makePhoneCall({
        phoneNumber: '0755-86955827'
    })
  },
  // 查看个人名片
  previewIdcardImage(e) {
    var current = e.target.dataset.src;
    let currentImgArr = [current];
    wx.previewImage({
      urls: currentImgArr // 需要预览的图片http链接列表  
    })
  },
})