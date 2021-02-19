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
        itemHide: 'down',
        index: '',
        idx: '',
        childIdx: ''

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
    onShow: function (options) {
        let updateCarType = wx.getStorageSync('updateCarType');
        if (updateCarType) {
            let brandList = this.data.brandList;
            let index = this.data.index;
            let idx = this.data.idx;
            let childIdx = this.data.childIdx;
            brandList[index].carTypeList[idx].subDealeruserPriceSettingList[childIdx].price = updateCarType;
            this.setData({
                brandList: brandList
            })
        }
        wx.removeStorageSync('updateCarType');

    },
    // 收缩列表
    listToggle(e) {
        let hide = e.currentTarget.dataset.hide;
        let index = e.currentTarget.dataset.index;
        let brandList = this.data.brandList;
        if (hide == true) {
            brandList[index].hide = false
            this.setData({
                brandList: brandList
            })
            return;
        }
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
        let token = wx.getStorageSync("token");
        wxRequest.post('/app/subdealeruserpricesetting/getList', data, token)
            .then(res => {
                brandList[index].carTypeList = res.data.list
                brandList[index].hide = true
                this.setData({
                    brandList: brandList,
                    itemHide: '',
                })
            })
    },
    childListToggle(e) {
        let hide = e.currentTarget.dataset.hide;
        let index = e.currentTarget.dataset.index;
        let parentIndex = e.currentTarget.dataset.parentindex;
        let brandList = this.data.brandList;
        if (hide == true) {
            brandList[parentIndex].carTypeList[index].hide = false
            this.setData({
                brandList: brandList
            })
            return;
        }
        brandList[parentIndex].carTypeList[index].hide = true
        this.setData({
            brandList: brandList
        })
    },
    // 更新车辆价格
    updatePrice(e) {
        let id = e.currentTarget.dataset.id;
        let price = e.currentTarget.dataset.price;
        let index = e.currentTarget.dataset.index;
        let idx = e.currentTarget.dataset.idx;
        let childidx = e.currentTarget.dataset.childidx;
        this.setData({
            index: index,
            idx: idx,
            childIdx: childidx,
        })
        wx.navigateTo({
            url: '../priceCarTypeSetting/priceCarTypeSetting?id=' + id + "&price=" + price
        })
    }
})