// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'

// 导入云操作工具类
import { login } from '../../utils/cloud.js'
// 导入本地工具类
import { setUserInfo } from '../../utils/util.js'
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
                that.goLogin(res)
            }
        })
    },
    // 登录 查询数据库是否存在这个用户 不存在则创建
    async goLogin(userProfile) {
        const res = await login(userProfile.userInfo)
        if (res.error) {
            // 如果出现错误
            wx.showToast({
                title: res.msg,
                icon: 'error',
                duration: 2000
            })
        } else {
            // 成功 存储用户信息
            setUserInfo(res.msg)
            console.log(res.msg);
            wx.navigateBack();

        }
    }
})