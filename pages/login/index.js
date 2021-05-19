// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 点击用户登录获取用户信息
    handleUserProfile() {
        const that = this
        wx.getUserProfile({
            desc: '完善个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                that.login(res)
            }
        })
    },
    // 登录 查询数据库是否存在这个用户 不存在则创建
    login(res) {
        console.log(res);
    }
})