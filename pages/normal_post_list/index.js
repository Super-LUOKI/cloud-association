// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { checkLogin, getTempNormalIds, removeTempNormalIds, getTextFromHtml } from '../../utils/util.js'
import { getPostListByIds, getTempUrlById, getUserBriefInfos } from '../../utils/cloud.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        postBriefList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: options.title
        });
        // this.onShow()
        // 获取帖子信息
        this.getPostBrief()
    },
    async getPostBrief() {
        const ids = getTempNormalIds()
        const { msg } = await getPostListByIds(ids)

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


        removeTempNormalIds()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        checkLogin()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})