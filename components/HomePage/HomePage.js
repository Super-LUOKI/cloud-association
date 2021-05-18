// components/HomePage/HomePage.js
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
        // 轮播图测试数据
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 轮播图测试函数
        changeIndicatorDots() {
            this.setData({
                indicatorDots: !this.data.indicatorDots
            })
        },

        changeAutoplay() {
            this.setData({
                autoplay: !this.data.autoplay
            })
        },

        intervalChange(e) {
            this.setData({
                interval: e.detail.value
            })
        },

        durationChange(e) {
            this.setData({
                duration: e.detail.value
            })
        },
        // 每次组件展示执行的事件
        handleShow() {
            // console.log(111);
        }

    }
})