// pages/applyOrganization/applyOrganization.js
import wxRequest from "../../utils/request";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 1,       // 默认显示的序号
        carType: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync("token");
        // 获取品牌信息
        let url = '/app/subdealerbrand/getList'
        wxRequest.get(url, "", token)
            .then(res => {
                this.setData({
                    carType: res.data.carVos
                })
            })
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
        this.setData({['carType']: list})
    },
    // 选择车辆品牌
    selectCarType(e) {
        let carType = e.currentTarget.dataset;
        wx.setStorageSync('carType', {
            id: carType.id,
            name: carType.name,
            brandid: carType.brandid,
            brandname: carType.brandname
        });
        wx.navigateBack({
            url: '../orderStep/orderStep'
        })
    }
})