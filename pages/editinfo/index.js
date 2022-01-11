import { areaList } from '@vant/area-data'
// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { setUserInfo, getUserInfo } from '../../utils/util.js'
import { updateUserInfo } from '../../utils/cloud.js'
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
        // schoolList: ['鲁东大学', '烟台大学'],
        // 学校数据字符串格式
        schoolStr: '',
        userInfo: {},
        school: '',
        username: '',
        brief: ''

    },
    innerData: {
        // 当前的用户id
        user_id: ''
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
    // 选择学校（暂时不用）
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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const { user_id } = options
        this.innerData.user_id = user_id
        this.showUserInfo()
    },
    // 获取并展示用户信息
    async showUserInfo() {
        // 获取用户信息
        const userInfo = getUserInfo()
        let theData = this.data
        theData.sex = userInfo.gender
        theData.areaStr = `${userInfo.province.name} ${userInfo.city.name} ${userInfo.district.name}`
        theData.schoolStr = userInfo.university.name
        theData.userInfo = userInfo
        theData.username = userInfo.username
        theData.brief = userInfo.brief
        this.setData(theData)
    },
    // 确认修改信息
    async handleConfirmUpdatae() {
        const username = this.data.username.trim()
        const brief = this.data.brief
        const gender = this.data.sex
        const school_str = this.data.schoolStr
        const modifyUserInfo = { username, brief, gender, university: { code: '-1', name: school_str } }
        const areaArr = this.data.areaData
        if (areaArr.length === 3) {
            modifyUserInfo.province = areaArr[0]
            modifyUserInfo.city = areaArr[1]
            modifyUserInfo.district = areaArr[2]

        }
        const res = await updateUserInfo(modifyUserInfo)
        if (!res.error) {
            setUserInfo(res.msg)
            wx.navigateBack();

        }
    }

})