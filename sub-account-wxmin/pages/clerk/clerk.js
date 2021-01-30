// pages/trialSteps/trialSteps.js
import wxRequest from '../../utils/request'
import wxVaildate from '../../utils/wx_validate'
import util from '../../utils/util'
const qiniuUploader = require("../../utils/qiniuUploader");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idCard: '',
    cardUrl: '',
    phone: '',
    openid: '',
    buttonStatus: false, //点击按钮的状态
    buttonClicked: false,
    checked: false,
    acceptPopup: false     // 授权内容弹窗显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = wx.getStorageSync("phone");
    let openid = wx.getStorageSync("openid");
    this.setData({
      phone: phone,
      openid: openid
    })
  },

  // 打开授权内容弹窗
  openAcceptPopup() {
    this.setData({
      acceptPopup: true
    })
  },

  // 关闭授权内容弹窗
  closeAcceptPopup() {
    this.setData({
      acceptPopup: false
    })
  },

  // 控制登录按钮的显示状态
  activeButton: function () {
    let {
      name,
      idCard,
      cardUrl,
      checked
    } = this.data;
    if (name && idCard.length == 18 && cardUrl && checked) {
      this.setData({
        buttonStatus: true
      })
    } else {
      this.setData({
        buttonStatus: false
      })
    }
  },

  // 输入姓名
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
    this.activeButton();
  },

  // 输入身份证号
  inputIdcard: function (e) {
    let idCard = e.detail.value;
    if (idCard.length == 18) {
      let checkedCard = wxVaildate.checkIdcard(idCard);
      if (checkedCard) {
        this.setData({
          idCard: idCard
        })
      }
    } else {
      this.setData({
        idCard: ''
      })
    }
    this.activeButton();
  },

  // 上传图片
  uploadImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        util.showLoading('上传中...');
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        // let baseUrl = wxRequest._baseUrl;
        // let token = wx.getStorageSync("token");
        // wx.uploadFile({
        //   url: baseUrl + '/common/fileUpload?token=' + token,
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   header: {  
        //     "Content-Type": "multipart/form-data",
        //   },
        //   success(res) {
        //     util.hideLoading();
        //     let resData = JSON.parse(res.data);
        //     let content = resData.content[0];
        //     let realPath = content.fileUrl;
        //     that.setData({
        //       cardUrl: realPath
        //     })
        //     that.activeButton();
        //   },
        //   fail(res) {
        //     wx.showToast({
        //       icon: 'none',
        //       title: '请求超时，请重试'
        //     })
        //     return false;
        //   }
        // })

        qiniuUploader.upload(tempFilePaths[0], (res) => {
          util.hideLoading();
          let realPath = res.imageURL;
          that.setData({
            cardUrl: realPath
          })
          that.activeButton();
        }, (error) => {
          wx.showToast({
            icon: 'none',
            title: error
          })
          return false;
        }, {
          region: 'ECN',
          uploadURL: 'https://up.qiniup.com',
          uptokenURL: 'https://api.diangc.cn/common/getFileUploadToken',
          domain: 'http://file.diangc.cn'
        })
      }
    })
  },

  // 删除图片
  deleteImg() {
    this.setData({
      cardUrl: ''
    })
    this.activeButton();
  },

  // 查看图片
  previewImage(e) {
    var current = e.target.dataset.src;
    let currentImgArr = [current];
    wx.previewImage({
      urls: currentImgArr // 需要预览的图片http链接列表  
    })
  },

  onChange(event) {
    this.setData({
      checked: event.detail
    });
    this.activeButton();
  },

  // 店员资格认证提交
  nextStep() {
    if (this.data.buttonStatus) {
      util.buttonClicked(this);
      let sendData = {};
      sendData.name = this.data.name;
      sendData.phone = this.data.phone;
      sendData.openId = this.data.openid;
      sendData.idCard = this.data.idCard;
      sendData.cardUrl = this.data.cardUrl;

      wxRequest.post('/sell/auditSell', sendData)
        .then(res => { //请求成功
          if(res.data.status == 1){
            // wx.setStorageSync('isCheck',"3");    // 设置认证状态为审核中
            wx.reLaunch({
              url: '../attestDetails/attestDetails'
            })
          }
        })
    } else {
      return false;
    }
  }
})
