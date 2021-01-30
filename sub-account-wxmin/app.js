//app.js
import wxRequest from '/utils/request'
import util from '/utils/util'
App({
  onLaunch: function () {
    // 拦截统一配置
    this.configReq();
  },
  globalData: {
    userInfo: null,
    token: ''
  },
  configReq(){
    // 获取用户的openid
    wx.login({
      success(res) {
        if(res.code){
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa31c64427655531c&secret=1fcc0c8477cfbfe0732ea36d27f1e248&js_code='+res.code+'&grant_type=authorization_code',//获取openid的url，请求微信服务器
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              let openid = res.data.openid;
              wx.setStorageSync('openid', openid);
            }
          })
        }
      }
    })
    this.loadPage();
  },
  loadPage() {
    this.globalData.token = wx.getStorageSync("token");
    if(!this.globalData.token){     //如果不存在token
      wx.reLaunch({  //跳转到登录页面
        url: '/pages/login/login'
      })
    }else{
      wxRequest.post('/sell/getSell',this.globalData.token)
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
          wx.reLaunch({  
            url: '/pages/order/order'
          })
        }
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