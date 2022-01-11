// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { getTextFromHtml, getUserInfo, chooseImage, getTempImg, createUniqueImgName, removeTempImg, setUserInfo, setTempUserIds, checkLogin } from '../../utils/util.js'
import { getUserBriefInfos, getPostListByIds, getAssoNoticePostIds, getAssoActivityPostIds, getTempUrlById, updateUserBgImg, getUserInfoById, getAssociationById } from '../../utils/cloud.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 社团信息
        assoInfo: {},
        // 创建者信息
        ownerInfo: {},
        // 管理员信息(暂时不用)
        adminInfo: [],
        // 成员操作弹出页
        isOptionsShow: false,
        memberOptons: [{
                name: '设置职位',
            },
            {
                name: '移出社团',
                color: '#ee0a24',
                subname: '此操作不可撤销'
            }
        ],
        // 是否是社团管理员
        isAdmin: false,
        // 资讯列表
        noticePostList: [],
        // 活动列表
        activityPostList: []
    },
    innerData: {
        asso_id: ''
    },
    // 点击 成员信息有方的操作图标
    handleMemberOption() {
        this.setData({
            isOptionsShow: true
        })
    },
    onMemberOptionsClose() {
        this.setData({ isOptionsShow: false });
    },

    onMemberOptionsSelect(event) {
        console.log(event.detail);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.innerData.asso_id = options.asso_id
        this.getAssociation()
    },
    // 获取社团信息
    async getAssociation() {
        const res = await getAssociationById(this.innerData.asso_id)
        if (!res.error) {
            this.setAssoInfo(res.msg)
        }
        this.getNoticePostList()
        this.getActivityPostList()
    },
    async getNoticePostList() {
        const { msg: ids } = await getAssoNoticePostIds(this.innerData.asso_id)
        const noticePostList = await this.getPostBrief(ids)
        this.setData({ noticePostList })
    },
    async getActivityPostList() {
        const { msg: ids } = await getAssoActivityPostIds(this.innerData.asso_id)
        const activityPostList = await this.getPostBrief(ids)
        this.setData({ activityPostList })
    },
    // 获取社团帖子信息
    async getPostBrief(ids) {
        const { msg } = await getPostListByIds(ids)

        // 简化帖子信息以适合列表显示
        const postBriefList = msg.map(post => {
            post.content.text = getTextFromHtml(post.content.html, 10)
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
        return postBriefList
    },
    // 修饰后添加社团信息到data中
    async setAssoInfo(rawAssoInfo) {
        // 获取图标以及背景url
        const { icon_file_id, bgc_file_id } = rawAssoInfo
        rawAssoInfo.icon_url = await getTempUrlById(icon_file_id)
        rawAssoInfo.bg_url = await getTempUrlById(bgc_file_id)

        // 获取纯文本格式的简短介绍
        rawAssoInfo.the_brief = getTextFromHtml(rawAssoInfo.brief.html, 64)

        // 获取会长（创建者）信息
        const ownerInfo = await this.getOwnerInfo(rawAssoInfo.owner_id)
        this.setData({ assoInfo: rawAssoInfo, ownerInfo })

    },
    // 获取管理员信息
    async getOwnerInfo(owner_id) {
        const res = await getUserInfoById(owner_id)
        if (!res.error) {
            return res.msg
        }
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