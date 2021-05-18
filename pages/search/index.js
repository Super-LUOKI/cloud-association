// pages/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否开始过搜索（控制空填充的显隐）
        isSearched: false,
        // tab导航激活项索引
        activeIndex: 0
    },
    // 不用渲染的数据
    theData: {
        // 搜索内容
        searchValue: ''
    },
    // 点击搜索
    handleSearch(e) {
        const content = this.theData.searchValue

        // 搜索成功后执行以下代码
        this.setData({
            isSearched: true
        })
    },
    // 搜索框内容变化事件
    handleSearchChange(e) {
        this.theData.searchValue = e.detail


    },
    // tab导航切换事件
    handleTabChange(e) {
        this.setData({
            activeIndex: e.detail.name
        })
    }
})