// pages/postdetail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否显示评论区
        isShowComment: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    // 点击评论图标 展开评论区事件
    hanldeOpenComment() {
        this.setData({ isShowComment: !this.data.isShowComment })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 关闭评论区
    onCloseComment() {
        this.setData({ isShowComment: !this.data.isShowComment })
    }
})