// components/SearchInput/SearchInput.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        placeholder: {
            type: String,
            value: '搜索感兴趣的内容'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 点击跳转到搜索页面
        handleTap() {
            wx.navigateTo({
                url: '/pages/search/index'
            });

        }
    }
})