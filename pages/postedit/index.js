// pages/postedit/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 帖子标题
        titleValue: '',
        // 作品分类（此处的数据应该由社团获取）
        postCategory1: [
            { text: '选择分类', value: -1 },
            { text: '灌水交流', value: 0 },
            { text: '失物招领', value: 1 },
            { text: '表白上墙', value: 2 },
            { text: '灌水交流', value: 3 },
            { text: '官方通知', value: 4 },
            { text: '社团纳新', value: 5 },
            { text: '社团活动', value: 6 },
            { text: '其他', value: 7 }
        ],
        postCategory2: [
            { text: '选择社团', value: -1 },
            { text: '灌水交流', value: 0 },
            { text: '灌水交流', value: 0 },
            { text: '失物招领', value: 1 },
            { text: '表白上墙', value: 2 },
            { text: '灌水交流', value: 3 },
            { text: '官方通知', value: 4 },
            { text: '社团纳新', value: 5 },
            { text: '社团活动', value: 6 },
            { text: '其他', value: 7 }
        ],
        value1: -1,
        value2: -1,

        // 富文本编辑器
        formats: {},
        readOnly: false,
        placeholder: '在这里尽情创作吧！',
        editorHeight: 300,
        keyboardHeight: 0,
        isIOS: false,
        dataObj: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const platform = wx.getSystemInfoSync().platform
        const isIOS = platform === 'ios'
        this.setData({ isIOS })
        const that = this
        this.updatePosition(0)
        let keyboardHeight = 0
        wx.onKeyboardHeightChange(res => {
            console.log(res.height)
            if (res.height === keyboardHeight) return
            const duration = res.height > 0 ? res.duration * 1000 : 0
            keyboardHeight = res.height
            setTimeout(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    success() {
                        that.updatePosition(keyboardHeight)
                        that.editorCtx.scrollIntoView()
                    }
                })
            }, duration)
        })
    },
    bindinput(e) {
        console.log("输入了啥：", e.detail);
        this.setData({ content: e.detail })
    },
    readOnlyChange() {
        this.setData({
            readOnly: !this.data.readOnly
        })
    },
    updatePosition(keyboardHeight) {
        const toolbarHeight = 50
        const { windowHeight, platform } = wx.getSystemInfoSync()
        let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
        this.setData({ editorHeight, keyboardHeight })
    },
    calNavigationBarAndStatusBar() {
        const systemInfo = wx.getSystemInfoSync()
        const { statusBarHeight, platform } = systemInfo
        const isIOS = platform === 'ios'
        const navigationBarHeight = isIOS ? 44 : 48
        return statusBarHeight + navigationBarHeight
    },
    // 编辑器初始化完成时触发
    onEditorReady() {
        const that = this;
        wx.createSelectorQuery().select('#editor').context(function(res) {
            that.editorCtx = res.context;
        }).exec();
    },
    // 撤销
    undo() {
        this.editorCtx.undo();
    },
    // 恢复
    redo() {
        this.editorCtx.redo();
    },
    format(e) {
        let {
            name,
            value
        } = e.target.dataset;
        if (!name) return;
        // console.log('format', name, value)
        this.editorCtx.format(name, value);
    },
    // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
    onStatusChange(e) {
        const formats = e.detail;
        this.setData({
            formats
        });
    },
    // 插入分割线
    insertDivider() {
        this.editorCtx.insertDivider({
            success: function() {
                console.log('insert divider success')
            }
        });
    },
    // 清除
    clear() {
        this.editorCtx.clear({
            success: function(res) {
                console.log("clear success")
            }
        });
    },
    // 移除样式
    removeFormat() {
        this.editorCtx.removeFormat();
    },
    // 插入当前日期
    insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
            text: formatDate
        });
    },
    // 插入图片
    insertImage() {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                this.editorCtx.insertImage({
                    src: res.tempFilePaths[0],
                    width: '100%',
                    data: {
                        id: 'abcd',
                        role: 'god'
                    }
                })
            }
        });
    },
    //选择图片
    chooseImage(e) {
        wx.chooseImage({
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                const images = this.data.images.concat(res.tempFilePaths);
                this.data.images = images.length <= 3 ? images : images.slice(0, 3);
            }
        })
    }
})