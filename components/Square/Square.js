// components/Square/Square.js
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

    },
    outerData: {},

    /**
     * 组件的方法列表
     */
    /* 
    优化性能
    将获取的数据放到outerData中，在data中每个类型只放5个条目，下滑刷新则更新
    theData并将最新的5个放到data中，上滑到列表顶则从theData中取出“上5个”，放到data中，
    */

    methods: {
        // 每次组件展示执行的事件
        handleShow() {
            // console.log(111);
        }
    }
})