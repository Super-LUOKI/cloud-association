import { areaList } from '@vant/area-data'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 性别
        sex: 0,
        // 地区选择
        areaList,

        // 选择地区的弹出层显隐
        areaPopupVisible: false,
        // 地区数据
        areaData: [],
        // 地区数据字符串格式
        areaStr: '点击选择',

        // 选择学校的弹出层显隐
        schoolPopupVisible: false,
        // 学校数据（根据地区后台获取）
        schoolList: ['鲁东大学', '烟台大学'],
        // 学校数据字符串格式
        schoolStr: '点击选择'

    },

    // 性别选择改变
    handleSexChange(e) {
        this.setData({ sex: e.detail })
    },
    // 选择地区
    chooseArea() {
        this.setData({
            areaPopupVisible: true,
        })
    },
    // 选择学校
    chooseSchool() {
        this.setData({
            schoolPopupVisible: true,
        })
    },

    //  取消选择地区
    handleCancelChooseArea() {
        this.setData({ areaPopupVisible: false })
    },
    // 确认选择地区
    handleConfirmChooseArea(e) {
        this.setData({
            areaData: e.detail.values,
            areaStr: e.detail.values.map(v => v.name).join(' ')
        })
        this.handleCancelChooseArea()
    },

    // 取消选择学校
    handleCancelChooseSchool() {
        this.setData({ schoolPopupVisible: false })
    },

    // 确认选择学校
    handleConfirmChooseSchool(e) {
        const { index, value } = e.detail
        this.setData({
            schoolStr: value
        })
        this.handleCancelChooseSchool()
    }

})