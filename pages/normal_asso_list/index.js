// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { checkLogin, getTempNormalIds, removeTempNormalIds, getUserInfo, chooseImage, getTempImg, createUniqueImgName, removeTempImg, setUserInfo, setTempUserIds, getTextFromHtml } from '../../utils/util.js'
import { getAssoBriefInfos, uploadCloudFile, getTempUrlById, updateUserBgImg, getUserInfoById } from '../../utils/cloud.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        assoList: []
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: options.title
        });
        // 获取社团简介信息
        this.getAssoBriefList()
    },

    // 获取社团简介信息
    async getAssoBriefList() {
        const ids = getTempNormalIds();
        console.log(ids);
        const res = await getAssoBriefInfos(ids)
        if (!res.error) {
            this.setAssoList(res.msg)
        }

        removeTempNormalIds()
    },
    // 修饰并将社团列表信息添加到data中
    async setAssoList(rawList) {
        for (let i = 0; i < rawList.length; i++) {
            const assoInfo = rawList[i];
            assoInfo.icon_url = await getTempUrlById(assoInfo.icon_file_id)
            assoInfo.the_brief = getTextFromHtml(assoInfo.brief.html, 30)

        }
        this.setData({ assoList: rawList })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        checkLogin()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})