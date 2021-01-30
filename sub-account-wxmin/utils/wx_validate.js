const wxValidate = {
    // 验证手机格式
    checkPhoneNum(value) {
        let str = /^1[34578]\d{9}$/;
        if (str.test(value)) {
          return true
        } else {
          wx.showToast({
            title: '手机号码错误',
            icon: 'none'
          })
          return false
        }
    },
    // 验证身份证号码
    checkIdcard(value) {
        let str = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (str.test(value)) {
          return true
        } else {
          wx.showToast({
            title: '身份证号码格式错误',
            icon: 'none'
          })
          return false
        }
    }
}

export default wxValidate
  