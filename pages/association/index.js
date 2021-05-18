// pages/association/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 成员操作弹出页
        isOptionsShow: false,
        memberOptons: [{
                name: '设置职位',
            },
            {
                name: '移出社团',
                color: '#ee0a24',
                subname: '此操作不可撤销'
            }
        ]
    },

    // 点击 成员信息有方的操作图标
    handleMemberOption() {
        this.setData({
            isOptionsShow: true
        })
    },
    onMemberOptionsClose() {
        console.log(1);
        this.setData({ isOptionsShow: false });
    },

    onMemberOptionsSelect(event) {
        console.log(event.detail);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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