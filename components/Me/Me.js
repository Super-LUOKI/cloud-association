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
        brief: '点击登录，开启你的社团之旅~'

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
            } else {
                // 如果用户信息不存在
            }

        }
    }
})