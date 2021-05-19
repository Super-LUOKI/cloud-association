import { getUserInfo } from '../../utils/util.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        username: '点击登录',
        brief: '点击登录，开启你的社团之旅~',
        // 是否已经登录
        isLogin: false

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 每次组件展示执行的事件
        handleShow() {
            //  获取用户信息
            const userInfo = getUserInfo()
            if (userInfo) {
                // 如果用户信息存在
                this.setData({ isLogin: true })
            }
        },
        // 点击 头像、简介用户信息
        handleClickInfo() {
            // 如果没登录则提示登录，否则不做操作
            if (!this.data.isLogin) {
                wx.navigateTo({
                    url: '/pages/login/index'
                });

            }
        }

    }
})