// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { showToast, getUserInfo, setUserInfo, checkLogin } from '../../utils/util.js'
import { getUserBriefInfos, getCommentsByPostId, addComment, updateSingleUserCollect, addLikeCount, addViewCount, getPostInfoById, getTempUrlById, getUserInfoById } from '../../utils/cloud.js'
var WxParse = require('../../lib/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否显示评论区
        isShowComment: false,
        // 帖子数据
        postInfo: {},
        // 作者信息
        authorInfo: {},
        // 是否已经收藏该帖子
        hasCollect: false,
        // 评论内容
        commentValue: '',
        // 评论信息
        commentsList: []
    },
    innerData: {
        post_id: '',
        // 是否已经点赞
        hasLike: false,
        // 本地用户信息
        userInfo: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.innerData.post_id = options.post_id
        const userInfo = getUserInfo()
        if (!userInfo) {
            checkLogin()
            return
        }
        // 获取本地用户信息
        this.innerData.userInfo = userInfo
            // 获取帖子信息
        this.getPostInfo()

        // 获取评论内容
        this.getComments()

        // 增加1个阅读数量
        this.addTheViewCount()

    },

    // 获取评论内容
    async getComments() {
        const res = await getCommentsByPostId(this.innerData.post_id)
        if (!res.error) {
            this.setCommentInfo(res.msg)
        }
    },
    // 修饰并将评论数据添加到data中
    async setCommentInfo(rawCommentInfo) {
        // 获取评论相关的所有用户id
        const userIds = []
        for (let i = 0; i < rawCommentInfo.length; i++) {
            const currentUserId = rawCommentInfo[i].user_id
            if (userIds.findIndex(v => v === currentUserId) === -1) {
                userIds.push(currentUserId)
            }
        }
        // 获取用户信息
        const res = await getUserBriefInfos(userIds)
        if (!res.error) {
            const userInfos = res.msg
            const commentsList = rawCommentInfo.map(comment => {
                    // 当前遍历到的帖子的发帖者id对应在userInfos中的索引
                    const userInfoIndex = userInfos.findIndex(v => v._id === comment.user_id)
                    comment.userBrief = userInfos[userInfoIndex]
                    return comment
                })
                // 按照时间降序排列
            commentsList.sort((a, b) => {
                const aTime = (new Date(a.create_time)).getTime()
                const bTime = (new Date(b.create_time)).getTime()
                return bTime - aTime
            })
            this.setData({ commentsList })
        }
    },
    // 添加评论
    async handleComment() {
        const res = await addComment(this.innerData.post_id, this.innerData.userInfo._id, this.data.commentValue)
        if (!res.error) {
            this.getComments()
            this.setData({ commentValue: '' })
            showToast('评论成功')
        }
    },
    // 收藏操作
    async handleCollection() {
        const res = await updateSingleUserCollect(this.innerData.post_id, !this.data.hasCollect)
        if (!res.error) {
            setUserInfo(res.msg)
            this.innerData.userInfo = res.msg
            this.setPostInfo(this.data.postInfo)
        }
    },
    // 点击 赞同 按钮
    async handleLike() {
        if (this.innerData.hasLike) {
            return
        }
        const res = await addLikeCount(this.innerData.post_id, 1)
        if (!res.error) {
            let postInfo = this.data.postInfo
            postInfo.like_count += 1
            this.setData({ postInfo })
            this.innerData.hasLike = true
        }
    },

    // 增加1个阅读量
    async addTheViewCount() {
        await addViewCount(this.innerData.post_id, 1)
    },

    // 获取帖子详情
    async getPostInfo() {
        const res = await getPostInfoById(this.innerData.post_id)
        if (!res.error) {
            this.setPostInfo(res.msg)
        }
    },
    // 修饰帖子信息并放到data中
    async setPostInfo(rawPostInfo) {
        // 获取帖子的作者信息
        const { msg: authorInfo } = await getUserInfoById(rawPostInfo.author_id)

        // 判断是否已经收藏
        const collIndex = this.innerData.userInfo.collection.findIndex(v => v === rawPostInfo._id)
        const hasCollect = collIndex === -1 ? false : true

        // 转换并添加格式化的日期字符串
        const publishTime = new Date(rawPostInfo.create_time)
        rawPostInfo.publish_time = `${publishTime.getFullYear()}年${publishTime.getMonth() + 1}月${publishTime.getDate()}日`
            // 加载图片
        const post_file_maps = rawPostInfo.content.post_file_maps
        let html = rawPostInfo.content.html
        for (let i = 0; i < post_file_maps.length; i++) {
            const currentMap = post_file_maps[i]
            const imgTempUrl = await getTempUrlById(currentMap.remote_file_id)
            html = html.replaceAll(currentMap.local, imgTempUrl)
        }
        // 渲染富文本页面
        WxParse.wxParse('content', 'html', html, this, 5);
        this.setData({ postInfo: rawPostInfo, authorInfo, hasCollect })
    },
    // 点击评论图标 展开评论区事件
    hanldeOpenComment() {
        this.setData({ isShowComment: !this.data.isShowComment })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 关闭评论区
    onCloseComment() {
        this.setData({ isShowComment: !this.data.isShowComment })
    },
    // 点击 分享图标
    handleShare() {

    }
})