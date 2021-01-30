// pages/applyOrganization/applyOrganization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carFinance: ["宝马金融","先锋租赁","奔驰金融","一汽金融","一汽租赁","大众金融","丰田金融","日产金融","福特金融","悦达租赁","现代金融","沃尔沃金融","通用金融GMAC","长安汽车金融","华晨起亚汽车金融","奇瑞徽银汽车金融","广汽汇理汽车金融","东风标致雪铁龙金融","菲亚特克莱斯勒汽车金融"],
    bank: ["平安银行","中国银行","中信银行","招商银行","农业银行","福州农商银行","工商银行信用卡","建设银行信用卡","上海银行信用卡","中国邮政储蓄信用卡"],
    index: 1        // 默认显示的序号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 切换顶部nav标签
  switchNav(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
  },

  // 选择车贷审批机构
  selectOrganize(e) {
    let organize = e.currentTarget.dataset.organize;
    wx.setStorageSync('organize', organize);
    wx.navigateBack({
      url: '../orderStep/orderStep'
    })
  }
})