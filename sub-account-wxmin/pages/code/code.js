// pages/trialCode/trialCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,  //窗口高度
    codeUrl: '',    // 二维码链接
    showImg: false   // 是否显示二维码弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var winMsg = wx.getSystemInfoSync();
    var codeUrl =  wx.getStorageSync("codeUrl");
    this.setData({
      winHeight: winMsg.windowHeight,
      codeUrl: codeUrl
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 回到首页
  goHome() {
    wx.reLaunch({
      url: '/pages/order/order'
    })
  },

  // 发送二维码给好友
  onShareAppMessage: function (res) {
    if(res.form === 'button'){
      return {
        title: '授权二维码',
        path: '',
        imageUrl: this.data.codeUrl
      }
    }
  },
  shareImg: function(){
    wx.previewImage({
      urls: [this.data.codeUrl], 
    })
  },
  saveCodeImg: function(){
    let that = this;
    this.setData({
      showImg: true
    })

    // 绘制二维码图片
    var ctx = wx.createCanvasContext('trialCode');
    ctx.fillStyle = '#fff';
    ctx.drawImage('/images/share-bg.jpg', 0, 0, 260, 400);  
    wx.downloadFile({
      url: this.data.codeUrl,
      success: function (res) {
        if(res.tempFilePath) {
          ctx.drawImage(res.tempFilePath, 74, 229, 112, 112);
          ctx.draw(true,function(){
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: 260,
              height: 400,
              destWidth: 780,
              destHeight: 1200,
              canvasId: 'trialCode',
              success: function (res) {
                //将图片保存在系统相册中(应先获取权限，)
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    wx.showToast({
                      icon: 'none',
                      title: '图片已保存到相册，可分享给好友',
                      duration: 3000
                    })
                  },
                  fail: function (res) {
                    if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                      wx.openSetting({
                        success(settingdata) {
                          if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                            wx.showToast({
                              icon: 'none',
                              title: '图片已保存到相册，可分享给好友',
                            })
                          } else {
                            wx.showToast({
                              icon: 'none',
                              title: '获取权限失败'
                            })
                          }
                          }
                       })
                    }else{
                      wx.showToast({
                        icon: 'none',
                        title: '图片保存失败'
                      })
                    }
                  }
                })
              },
              fail: function () {
                console.log('get tempfilepath is fail')
              }
            })
          });
        }
      }
    })
  },
  closePopup: function(){
    this.setData({
      showImg: false
    })
  }
})