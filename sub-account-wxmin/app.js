//app.js
import wxRequest from '/utils/request'
import util from '/utils/util'
App({
  onLaunch: function (option) {
    console.log(option)
    if(option && option.query && option.query.orderno){
      wx.setStorageSync('clientOrderNumber', option.query.orderno);
      wx.reLaunch({
        url: '/pages/orderDetails/orderDetails?orderno=' + option.query.orderno + "&isUser=true"
      })
      return
    }
    this.loadPage();
    this.updateVersion();
  },
  globalData: {
    userInfo: null,
    token: ''
  },
  loadPage() {
    this.globalData.token = wx.getStorageSync("token");
    //如果不存在token
    if(!this.globalData.token){
      wx.reLaunch({  //跳转到登录页面
        url: '/pages/login/login'
      })
    }else{
      wx.reLaunch({
        url: '/pages/order/order'
      })
    }
  },
  updateVersion() {   //是否更新最新版
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否马上重启小程序？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  }
})