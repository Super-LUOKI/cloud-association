// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { getTextFromHtml } from '../../utils/util.js'
import { getPostListByCateId, getPostCategoryList, getTempUrlById, getUserBriefInfos } from '../../utils/cloud.js'
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
        cateList: [],
        postBriefList: [],
        currentCateId: ''
    },

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
            // 获取帖子信息
            this.getCateInfo()
        },
        // 获取分类信息
        async getCateInfo() {
            // 获取分类信息
            const { msg } = await getPostCategoryList()
            this.setData({ cateList: msg })
            console.log(this.data);
            if (!this.data.currentCateId) {
                this.setData({ currentCateId: msg[0]._id })
                this.getPostList()
            }
        },
        // 标签改变事件
        handleTabChanges(e) {
            this.setData({ currentCateId: e.detail.name })
            this.getPostList()
        },
        // 获取帖子简单信息
        async getPostList() {
            const cateId = this.data.currentCateId
            const { msg } = await getPostListByCateId(cateId, 0, 30)

            // 简化帖子信息以适合列表显示
            const postBriefList = msg.map(post => {
                post.content.text = getTextFromHtml(post.content.html, 40)
                post.title = post.title.length > 11 ? post.title.substring(0, 11) + '...' : post.title
                if (post.content.post_file_maps.length > 0) {
                    post.hasImg = true
                    post.img_id = post.content.post_file_maps[0].remote_file_id
                } else {
                    post.hasImg = false
                }
                return post
            })

            for (let i = 0; i < postBriefList.length; i++) {
                if (postBriefList[i].hasImg) {
                    postBriefList[i].img_url = await getTempUrlById(postBriefList[i].img_id)
                }
                // 获取作者信息
                const { msg: userBriefs } = await getUserBriefInfos([postBriefList[i].author_id])
                postBriefList[i].userBrief = userBriefs[0]
            }
            console.log(postBriefList);
            this.setData({ postBriefList })

        }
    }
})