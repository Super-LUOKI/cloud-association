Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 帖子信息列表
        assoList: {
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
        // 查看社团详情
        handleToDetail(e) {
            // 获取帖子id
            const { id } = e.currentTarget.dataset;
            wx.navigateTo({
                url: '/pages/association/index?asso_id=' + id
            });

        }
    }
})