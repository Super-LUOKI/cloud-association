Page({

    data: {
        // 底部导航选中的索引
        tabBarActiveIndex: 0,
    },
    innerData: {
        // 不同标签对应的页面标题名字
        pageTitles: ['云社团', '广场', '我的'],
        // 不同标签对应的id列表
        pageIds: ['#home_page', '#square_page', '#me_page']
    },
    // 底部导航栏选项改变事件
    onChange(e) {
        const index = e.detail
            // 设置标题栏标题
        wx.setNavigationBarTitle({
            title: this.innerData.pageTitles[index]
        });
        // 调用组件页面的方法
        this.selectComponent(this.innerData.pageIds[e.detail]).handleShow();
        this.setData({
            tabBarActiveIndex: index
        })

    },
    onShow() {
        // 调用组件页面的方法
        this.selectComponent(this.innerData.pageIds[this.data.tabBarActiveIndex]).handleShow();
    }




})