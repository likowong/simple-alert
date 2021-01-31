// pages/applyOrganization/applyOrganization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carFinance: ["宝马金融","先锋租赁","奔驰金融","一汽金融","一汽租赁","大众金融","丰田金融","日产金融","福特金融","悦达租赁","现代金融","沃尔沃金融","通用金融GMAC","长安汽车金融","华晨起亚汽车金融","奇瑞徽银汽车金融","广汽汇理汽车金融","东风标致雪铁龙金融","菲亚特克莱斯勒汽车金融"],
    bank: ["平安银行","中国银行","中信银行","招商银行","农业银行","福州农商银行","工商银行信用卡","建设银行信用卡","上海银行信用卡","中国邮政储蓄信用卡"],
    index: 1,       // 默认显示的序号
    carType: [
      {
        id: 1,
        text: '宝马',
        hide: false,
        children: [
          {
            id: 2,
            text: 'X1'
          },
          {
            id: 3,
            text: 'X2'
          }
        ]
      },
      {
        id: 4,
        text: '奔驰',
        hide: false,
        children: [
          {
            id: 5,
            text: '奔驰1'
          },
          {
            id: 6,
            text: '奔驰2'
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 收缩列表
  listToggle(e) {
    let id = e.currentTarget.dataset.id;
    let list = this.data.carType
     for (let i = 0, len = list.length; i < len; ++i) {
       if (list[i].id === id) {
         list[i].hide = !list[i].hide
       } else {
         list[i].hide = false
       }
     }
     this.setData({ ['carType']: list })
  },
  // 选择车辆品牌
  selectCarType(e) {
    let carType = e.currentTarget.dataset;
    wx.setStorageSync('carType', {id: carType.id, name: carType.name });
    wx.navigateBack({
      url: '../orderStep/orderStep'
    })
  }
})