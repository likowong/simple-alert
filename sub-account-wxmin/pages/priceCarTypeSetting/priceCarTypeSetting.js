// pages/applyOrganization/applyOrganization.js
import wxRequest from "../../utils/request";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        price: '',
        updatePrice: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        let price = options.price;
        this.setData({
            id: id,
            price: price
        })
    },
    // 输入数据
    inputData: function (e) {
        this.setData({
            updatePrice: e.detail.value
        })
    },

    // 更新车辆价格
    updatePrice(e) {
        let id = e.currentTarget.dataset.id;
        let updatePrice = this.data.updatePrice;
        if (!updatePrice) {
            wx.showToast({
                icon: 'none',
                title: "请设置金额",
            })
            return
        }
        let data = {
            "id": id,
            "price": updatePrice
        }
        let token = wx.getStorageSync("token");
        wxRequest.post('/app/subdealeruserpricesetting/update', data, token)
            .then(res => {
                wx.showToast({
                    icon: 'none',
                    title: "修改成功",
                })
                wx.setStorageSync('updateCarType', updatePrice);
                wx.navigateBack({
                    url: '../priceCarType/priceCarType'
                })
            })
    }
})