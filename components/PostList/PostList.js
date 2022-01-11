// components/PostList/PostList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 帖子信息列表
        postBriefList: {
            type: Array,
            value: []
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
        // 查看帖子详情
        handleToDetail(e) {
            // 获取帖子id
            const { id } = e.currentTarget.dataset;
            wx.navigateTo({
                url: '/pages/postdetail/index?post_id=' + id
            });

        }
    }
})