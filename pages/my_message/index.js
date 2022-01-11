import { getMessageList } from '../../utils/cloud.js'
import { checkLogin, setUserInfo, getUserInfo } from '../../utils/util.js'
// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageList: []
    },
    innerData: {
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        // 消息列表
        this.innerData.userInfo = getUserInfo()
        this.getMessageList()
    },
    async getMessageList() {
        const res = await getMessageList(this.innerData.userInfo._id)
        if (!res.error) {
            this.setData({ messageList: res.msg })
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