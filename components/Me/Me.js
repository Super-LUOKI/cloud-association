// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { setTempNormalIds, getUserInfo, chooseImage, getTempImg, createUniqueImgName, removeTempImg, setUserInfo, setTempUserIds } from '../../utils/util.js'
import { uploadCloudFile, getTempUrlById, updateUserBgImg, getUserInfoById } from '../../utils/cloud.js'
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

        // 是否已经登录
        isLogin: false,
        userInfo: {},
        // 默认背景图链接
        defaultBgcUrl: 'https://636c-cloudcampuscloud-3fz57jfc83c3c28-1305966898.tcb.qcloud.la/images/default_bg.png?sign=4da339b5f3284117561262984a703f3c&t=1621864820',
        // 更改背景图片相关
        bgcOptions: {
            actions: [
                { name: '更改背景图', option: 'change' },
                { name: '查看背景图', option: 'look' }
            ],
        },
        actionSheetVisible: {
            bgcVisible: false
        }

    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 每次组件展示执行的事件
        handleShow() {
            //  获取用户信息
            const userInfo = getUserInfo()
            if (userInfo) {
                // 如果用户信息存在
                this.setUserInfo(userInfo)
            } else {
                this.setData({ isLogin: false, userInfo: {} })
                return
            }

            this.uploadBgImg()
        },
        // 点击 头像、简介用户信息
        handleClickInfo() {
            // 如果没登录则提示登录，否则不做操作
            if (!this.data.isLogin) {
                wx.navigateTo({
                    url: '/pages/login/index'
                });

            }
        },
        // 设置可用于渲染的用户数据到data中
        async setUserInfo(rawInfo) {
            // 更新用户信息
            const userInfoRes = await getUserInfoById(rawInfo._id)
            if (!userInfoRes.error) {
                rawInfo = userInfoRes.msg
                setUserInfo(rawInfo)
            }
            const { bg_file_id } = rawInfo
            if (bg_file_id) {
                let bg_url = '';
                if (bg_file_id) {
                    bg_url = await getTempUrlById(bg_file_id)
                }
                rawInfo.bg_url = bg_url
            }
            this.setData({
                userInfo: rawInfo,
                isLogin: true
            })
        },
        // 点击背景图片 更改背景图片
        handleChangeBgImg() {
            if (!this.data.isLogin) return
            let actionSheetVisible = this.data.actionSheetVisible
            actionSheetVisible.bgcVisible = true
            this.setData({ actionSheetVisible })
        },

        // 取消动作面板 如果name存在则忽略e
        handleCancelAs(e, name) {
            let visibleName = name ? name : e.target.dataset.visibleName
            let actionSheetVisible = this.data.actionSheetVisible
            actionSheetVisible[visibleName] = false
            this.setData({ actionSheetVisible })
        },
        // 背景图动作面板选中事件
        handleBgOptions(e) {
            switch (e.detail.option) {
                case 'change':
                    this.changeBgcImg()
                    break;
                case 'look':
                    // 用户没有设置背景图则展示默认背景图
                    wx.previewImage({
                        urls: [(this.data.userInfo.bg_url ? this.data.userInfo.bg_url : this.data.defaultBgcUrl)] // 需要预览的图片http链接列表
                    })
                    break;
            }
            this.handleCancelAs(false, 'bgcVisible')
        },
        async changeBgcImg() {
            try {
                const tempFiles = await chooseImage(1)
                const imgTempPath = tempFiles[0].path
                wx.navigateTo({
                    url: `/pages/clip_image/index?imgSrc=${imgTempPath}&width=240&height=120&tag=set_bg`
                });

            } catch (error) {
                console.log('选择图片失败', error);
            }
        },
        // 上传并更改个人背景图片
        async uploadBgImg() {
            // 获取图片缓存信息，如果存在则更新背景图片
            const msgInfo = getTempImg()
            if (msgInfo.tag === 'set_bg') {
                const fileID = await uploadCloudFile(`images/${createUniqueImgName()}.png`, msgInfo.url)

                // 更新用户信息
                const res = await updateUserBgImg(fileID)
                if (!res.error) {
                    // 更新用户信息
                    setUserInfo(res.msg)
                    this.handleShow()
                } else {
                    // 如果出现错误
                    wx.showToast({
                        title: res.msg,
                        icon: 'error',
                        duration: 2000
                    })
                }

            }
            // 清空图片临时缓存
            removeTempImg()
        },

        // 点击 创作 进入自己的帖子列表
        handleWorks() {
            setTempNormalIds(this.data.userInfo.works)
            wx.navigateTo({ url: '/pages/normal_post_list/index?title=我的创作' });
        },
        // 点击 关注 进入关注列表
        handleFollow() {
            setTempUserIds(this.data.userInfo.follow)
            wx.navigateTo({ url: '/pages/normal_user_list/index?title=关注' });
        },

        // 点击 关注 进入关注列表
        handleFans() {
            setTempUserIds(this.data.userInfo.fans)
            wx.navigateTo({ url: '/pages/normal_user_list/index?title=粉丝' });
        },
        // 点击 我的收藏
        handleCollec() {
            setTempNormalIds(this.data.userInfo.collection)
            wx.navigateTo({ url: '/pages/normal_post_list/index?title=我的收藏' });
        },
        // 点击 我的社团
        handleMyAssociation() {
            setTempNormalIds(this.data.userInfo.associations)
            wx.navigateTo({ url: '/pages/normal_asso_list/index?title=我的社团' });
        }

    }
})