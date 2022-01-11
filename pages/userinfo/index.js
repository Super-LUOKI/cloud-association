import { getPostListByIds, getUserInfoById, getTempUrlById, follow, getUserBriefInfos } from '../../utils/cloud.js'
import { getTextFromHtml, checkLogin, setUserInfo, getUserInfo } from '../../utils/util.js'
// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否为本人资料页
        isMe: false,
        // 展示的用户信息
        userInfo: {},
        // 默认背景图链接
        defaultBgcUrl: 'https://636c-cloudcampuscloud-3fz57jfc83c3c28-1305966898.tcb.qcloud.la/images/default_bg.png?sign=4da339b5f3284117561262984a703f3c&t=1621864820',
        // 创作信息
        postBriefList: []

    },
    innerData: {
        // 被展示的用户信息的id
        user_id: '',
        // 已经登录的用户的信息
        myInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const { user_id } = options
        this.innerData.user_id = user_id
        this.getDisplayUserInfo()
    },
    // 设置可用于渲染的用户数据到data中
    async setUserInfo(rawInfo) {
        const { bg_file_id } = rawInfo
        if (bg_file_id) {
            let bg_url = '';
            if (bg_file_id) {
                bg_url = await getTempUrlById(bg_file_id)
                    // console.log(bg_url);
            }
            rawInfo.bg_url = bg_url
        }

        this.setData({
            userInfo: rawInfo
        })

        // 设置用户的帖子创作信息
        this.getPostBrief()
    },
    // 获取用户创作信息
    async getPostBrief() {
        const ids = this.data.userInfo.works
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
        console.log(postBriefList);
        this.setData({ postBriefList })
    },
    async getDisplayUserInfo() {
        const res = await getUserInfoById(this.innerData.user_id)
        if (!res.error) {
            // 处理用户信息性别
            let userInfo = res.msg
            switch (userInfo.gender) {
                case 0:
                    userInfo.genderStr = '男'
                    break;
                case 1:
                    userInfo.genderStr = '女'
                    break;
                default:
                    userInfo.genderStr = '未知'
                    break;
            }

            // 处理用户地址信息
            let province = userInfo.province.name
            let city = userInfo.city.name
            let district = userInfo.district.name
            let addressStr = `${province} ${city} ${district}`
            userInfo.addressStr = addressStr

            // 判断是否已经关注此用户
            this.innerData.myInfo = getUserInfo()
            const myFollowList = this.innerData.myInfo.follow
            if (myFollowList.findIndex(v => v === this.innerData.user_id) === -1) {
                userInfo.hasFollow = false
            } else {
                userInfo.hasFollow = true
            }
            this.setUserInfo(userInfo)
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        checkLogin(userInfo => {
            // 判断展示信息的用户是否是自己
            if (userInfo._id === this.innerData.user_id) {
                this.setData({ isMe: true })
            } else {
                this.setData({ isMe: false })
            }
        })



    },
    // 点击 关注
    async handleFollow(e) {
        const { isFollow } = e.target.dataset
        const target_id = this.innerData.user_id
        const res = await follow(target_id, !isFollow)

        // console.log(res);
        if (!res.error) {

            // 更新本地用户信息
            setUserInfo(res.msg)

            // 更新页面
            this.getDisplayUserInfo()
        }

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})