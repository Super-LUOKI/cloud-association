import { getUserInfoById, getMessageRecord, sendMessage } from '../../utils/cloud.js'
import { checkLogin, setUserInfo, getUserInfo } from '../../utils/util.js'
// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 对方的用户信息
        targetUserInfo: {},
        // 聊天记录
        messageRecord: [],
        // 发送给对方的内容
        sendMsg: '',
        // 对方的用户id
        target_id: ''

    },
    innerData: {
        // 对方的用户id
        target_id: '',
        targetUserInfo: {},
        // 本地用户信息
        userInfo: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
        const target_id = options.target_id
        this.setData({ target_id })

        // 获取本地用户信息
        this.innerData.userInfo = getUserInfo()
        await this.getTargetUserInfo()
        await this.getMessageRecord()

    },
    // 获取对方的用户信息并设置标题为对方名字
    async getTargetUserInfo() {
        const res = await getUserInfoById(this.data.target_id)
        if (!res.error) {
            const targetUserInfo = res.msg
            this.innerData.targetUserInfo = targetUserInfo.msg
            console.log();
            wx.setNavigationBarTitle({ title: targetUserInfo.username });
        }
    },
    // 获取消息记录
    async getMessageRecord() {
        const res = await getMessageRecord(this.innerData.userInfo._id, this.data.target_id)
        if (!res.error) {
            console.log(res.msg);
            this.setData({
                messageRecord: res.msg
            })
        }
    },

    // 发送消息
    async sendMessage() {
        const res = await sendMessage(this.data.target_id, this.innerData.userInfo._id, this.data.sendMsg)
        if (!res.error) {
            this.setData({
                messageRecord: res.msg,
                sendMsg: ''
            })
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})