// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { getUserBriefInfos } from '../../utils/cloud.js'
import { checkLogin, getTempUserIds } from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfoList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: options.title
        });
        // 获取用户id列表
        const ids = getTempUserIds()
        this.getUserBriefInfos(ids)
    },
    // 获取简单的用户信息
    async getUserBriefInfos(ids) {
        const res = await getUserBriefInfos(ids)
        if (!res.error) {
            this.setData({ userInfoList: res.msg })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        checkLogin()
    },




    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})