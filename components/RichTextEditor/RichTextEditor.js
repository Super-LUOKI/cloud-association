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
        // 富文本编辑器
        formats: {},
        readOnly: false,
        placeholder: '开始你的创作',
        editorHeight: 300,
        keyboardHeight: 0,
        isIOS: false,
        dataObj: '',

    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindinput(e) {
            this.triggerEvent('InputContent', e.detail)
                // console.log("输入了啥：", e.detail);
                // this.setData({ content: e.detail })
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
            this.createSelectorQuery().select('#editor').context(function(res) {
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
    },
    // 组件生命周期
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
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
        }
    }
})