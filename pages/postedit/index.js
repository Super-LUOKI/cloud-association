// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { showToast, setTempNormalIds, getUserInfo, chooseImage, getTempImg, createUniqueImgName, removeTempImg, setUserInfo, setTempUserIds, checkLogin } from '../../utils/util.js'
import { createPost, getPostCategoryList, uploadCloudFile, getTempUrlById, updateUserBgImg, getUserInfoById, getAssoBriefInfos } from '../../utils/cloud.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 帖子标题
        titleValue: '',
        // 作品分类（此处的数据应该由社团获取）
        postCategory1: [

            // { text: '选择分类', value: -1 },
            // { text: '灌水交流', value: 0 },
            // { text: '失物招领', value: 1 },
            // { text: '表白上墙', value: 2 },
            // { text: '灌水交流', value: 3 },
            // { text: '官方通知', value: 4 },
            // { text: '社团纳新', value: 5 },
            // { text: '社团活动', value: 6 },
            // { text: '其他', value: 7 }
        ],
        postCategory2: [
            // { text: '选择社团', value: -1 },
            // { text: '灌水交流', value: 0 },
            // { text: '灌水交流', value: 0 },
            // { text: '失物招领', value: 1 },
            // { text: '表白上墙', value: 2 },
            // { text: '灌水交流', value: 3 },
            // { text: '官方通知', value: 4 },
            // { text: '社团纳新', value: 5 },
            // { text: '社团活动', value: 6 },
            // { text: '其他', value: 7 }
        ],
        id_1: '-1',
        id_2: '-1',
        // 帖子内容
        content: {
            html: ''
        }

    },
    innerData: {
        // 用户信息
        userInfo: {},
        // 当前帖子分类信息列表
        postCategoryList: [],
        // 社团信息列表
        assoInfoList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onShow() {
        checkLogin(userInfo => this.innerData.userInfo = userInfo)

        // 获取分类数据
        this.getCategoryList()

        // 获取用户的社团信息
        this.getUserAssoList()
    },
    onRichTextInput(e) {
        this.setData({ content: e.detail })
    },
    async getCategoryList() {
        const res = await getPostCategoryList()
        if (!res.error) {
            this.innerData.postCategoryList = res.msg
            const cateArr = [{ text: '选择分类', value: '-1' }]
            for (let i = 0; i < res.msg.length; i++) {
                const currentCate = res.msg[i]
                cateArr.push({ text: `${currentCate.name} ${currentCate.asso ? '（需选社团）' : ''}`, value: currentCate._id })
            }
            this.setData({ postCategory1: cateArr })
        }
    },
    async getUserAssoList() {
        const res = await getAssoBriefInfos(this.innerData.userInfo.associations)
        if (!res.error) {
            this.innerData.assoInfoList = res.msg
            const assoArr = [{ text: '选择社团', value: '-1' }]
            for (let i = 0; i < res.msg.length; i++) {
                const currentAsso = res.msg[i]
                assoArr.push({ text: currentAsso.name, value: currentAsso._id })
            }
            this.setData({ postCategory2: assoArr })
        }
    },
    // 分类选项改变事件
    handleCategoryChange(e) {
        const value = e.detail
        this.setData({ id_1: value })

    },
    // 社团选择选项改变事件
    handleAssoChange(e) {
        const value = e.detail
        this.setData({ id_2: value })
    },

    // 点击 立即发布
    async handSubmit() {
        if (this.data.titleValue.trim().length <= 0 || this.data.content.html.length < 10) {
            showToast('请完善创作内容')
            return
        }
        // 判断是否选择分类
        if (this.data.id_1 === '-1') {
            showToast('请选择分类')
            return
        }
        // 判断当前分类是否需要选择社团
        const index = this.innerData.postCategoryList.findIndex(v => v._id === this.data.id_1)
        const currentCate = this.innerData.postCategoryList[index]
        const isNeedAsso = currentCate.asso
        if (isNeedAsso && this.data.id_2 === '-1') {
            showToast('请选择社团')
            return
        }
        // 开始提交帖子
        if (isNeedAsso) {
            this.submitPost(currentCate.type, this.data.id_2)
        } else {
            this.submitPost(currentCate.type, 'null')
        }
    },

    // 提交帖子
    async submitPost(postType, asso_id) {

        const post_file_maps = []
        const html = this.data.content.html
            // 上传帖子内含有的背景图片
        for (let i = 0; i < this.data.content.delta.ops.length; i++) {
            const ele = this.data.content.delta.ops[i]
            if (ele.insert && ele.insert.image) {
                // 本地路径和远程id的对应关系
                const remote_file_id = await uploadCloudFile(`images/${createUniqueImgName()}_asso_brief_${i}.png`, ele.insert.image)
                post_file_maps.push({ local: ele.insert.image, remote_file_id })
            }
        }

        // console.log({
        //     title: this.data.titleValue,
        //     content: { html, post_file_maps },
        //     author_id: this.innerData.userInfo._id,
        //     part_id: this.data.id_1,
        //     postType,
        //     asso_id
        // });
        const res = await createPost(
            this.data.titleValue, { html, post_file_maps },
            this.innerData.userInfo._id,
            this.data.id_1,
            postType,
            asso_id
        )
        if (!res.error) {
            const { post_id, userInfo } = res.msg
            setUserInfo(userInfo)
            wx.redirectTo({
                url: '/pages/postdetail/index?post_id=' + post_id
            });

        }
    }
})