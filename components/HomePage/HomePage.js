// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { getTextFromHtml, setTempNormalIds } from '../../utils/util.js'
import { getPostListByCateId, getPostCategoryList, getTempUrlById, getHotAssoBriefInfos, getUserBriefInfos } from '../../utils/cloud.js'
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
        background: ['http://photo.tuchong.com/3164964/f/461570203.jpg', 'http://qqpublic.qpic.cn/qq_public/0/0-3200330413-8CDFE6DB58F71C171D843B2BE4846B09/0?fmt=jpg&size=127&h=506&w=900&ppv=1/0'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        // 帖子分类列表
        cateList: [],
        // 帖子简单信息列表
        postBriefList: [],
        // 中部社团信息
        assoList: [],
        // 下部帖子分类id
        currentCateId: ''
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
            // 获取中部社团信息
            this.getAssoList()

            // 获取下方分类信息
            this.getCateInfo()

        },
        // 获取前四个热门的社团信息
        async getAssoList() {
            const { msg } = await getHotAssoBriefInfos(4)
            for (let i = 0; i < msg.length; i++) {
                msg[i].bg_url = await getTempUrlById(msg[i].bgc_file_id)
            }
            this.setData({ assoList: msg })
        },
        // 获取分类信息
        async getCateInfo() {
            // 获取分类信息
            const { msg } = await getPostCategoryList()
            this.setData({ cateList: msg })
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
            const { msg } = await getPostListByCateId(cateId, 0, 4)

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

        },
        // 点击 热门社团 的 查看更多
        async handleMoreAsso() {
            const { msg } = await getHotAssoBriefInfos(50)
            const ids = msg.map(v => v._id)
            setTempNormalIds(ids)
            wx.navigateTo({ url: '/pages/normal_asso_list/index?title=热门社团' });

        }

    }

})