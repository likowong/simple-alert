// pages/attest/attest.js
import wxRequest from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,  //窗口高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let winMsg = wx.getSystemInfoSync();
    this.setData({
      winHeight: winMsg.windowHeight
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转到店员认证页面
  attestClerk: function(){
    wx.navigateTo({
      url: '../clerk/clerk'
    })
  }
})