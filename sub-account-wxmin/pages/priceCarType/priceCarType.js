// pages/applyOrganization/applyOrganization.js
import wxRequest from "../../utils/request";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        brandId: '',
        brandName: '',
        produceName: '',
        produceCode: '',
        productType: '',
        produceTypeNum: '',
        yearOfPrice: '',
        brandList: [],
        itemHide: 'down'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync("token");
        let yearOfPrices = options.yearOfPrice.split(",");
        wxRequest.get('/app/subdealerbrand/list', '', token)
            .then(res => {
                this.setData({
                    brandList: res.data.brandList,
                    produceName: options.produceName,
                    produceCode: options.produceCode,
                    productType: options.productType,
                    produceTypeNum: options.produceTypeNum,
                    yearOfPrice: yearOfPrices
                })
            })
    },
    // 收缩列表
    listToggle(e) {
        let index = e.currentTarget.dataset.index;
        let brandid = e.currentTarget.dataset.brandid;
        let brandName = e.currentTarget.dataset.brandname;
        let data = {
            "brandId": brandid,
            "brandName": brandName,
            "produceName": this.data.produceName,
            "produceCode": this.data.produceCode,
            "productType": this.data.productType,
            "produceTypeNum": this.data.produceTypeNum,
            "yearOfPrice": this.data.yearOfPrice
        }
        let brandList = this.data.brandList;
        let token = wx.getStorageSync("token");
        wxRequest.post('/app/subdealeruserpricesetting/getList', data, token)
            .then(res => {
                brandList[index.split("-")[0]].carTypeList = res.data.list
                this.setData({
                    brandList: brandList
                })
            })
    },
    // 更新车辆价格
    updatePrice(e) {
        let id = e.currentTarget.dataset.id;
        let data = {
            "id": id,
            "price": "1200"
        }
    }
})