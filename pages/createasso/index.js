// pages/createasso/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 步骤条信息
        steps: [{
                text: '基本信息'
            },
            {
                text: '社团简介'
            },
            {
                text: '社团徽标'
            }
        ],
        // 步骤条信息
        stepBarActiveIndex: 2
    },
    // 与页面渲染无关的数据
    theData: {
        // 富文本编辑器的内容
        richInputContent: {}
    },

    // 点击 上一步/下一步
    handleStep(e) {
        // 获取前进后退的步数
        const { step } = e.currentTarget.dataset;
        let stepBarActiveIndex = this.data.stepBarActiveIndex + parseInt(step)
        this.setData({ stepBarActiveIndex })
    },
    onRichTextInput(e) {
        this.theData.richInputContent = e.detail;
        console.log(this.theData.richInputContent);
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