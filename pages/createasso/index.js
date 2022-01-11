// 使用js高级语法（async await）
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { checkLogin, chooseImage, createUniqueImgName, setUserInfo } from '../../utils/util.js'
import { uploadCloudFile, createAssociation } from '../../utils/cloud.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 创建的社团信息
        name: '',
        contact: '',
        belong: '',
        brief: {},
        icon_url: '',
        bgc_url: '',
        // 步骤条信息
        steps: [{
                text: '基本信息'
            },
            {
                text: '社团简介'
            },
            {
                text: '社团徽标'
            }
        ],
        // 步骤条信息
        stepBarActiveIndex: 0
    },
    // 与页面渲染无关的数据
    theData: {
        // 富文本编辑器的内容
        richInputContent: {},
        userInfo: {}
    },

    // 点击 上一步/下一步
    handleStep(e) {
        // 获取前进后退的步数
        const { step } = e.currentTarget.dataset;

        let stepBarActiveIndex = this.data.stepBarActiveIndex + parseInt(step)

        const {
            name,
            contact,
            belong,
            brief,
            icon_url,
            bgc_url,
        } = this.data
        if (parseInt(step) > 0) {
            switch (this.data.stepBarActiveIndex) {
                case 0:
                    if (name.trim() === '' || contact.trim() === '' || belong.trim() === '') {
                        wx.showToast({
                            title: '请先完成信息填写',
                            icon: 'error',
                            duration: 1500
                        })
                        return;
                    }
                    break;
                    // case 1:
                    //     // 此处不好判断,以后写
                    //     if (brief.text) {
                    //         wx.showToast({
                    //             title: '请先完成社团简介',
                    //             icon: 'error',
                    //             duration: 1500
                    //         })
                    //         return;
                    //     }

                    //     break;
                case 2:
                    if (icon_url.trim() === '' || bgc_url.trim() === '') {
                        wx.showToast({
                            title: '请先完成图片上传',
                            icon: 'error',
                            duration: 1500
                        })
                        return;
                    } else {
                        this.createAssociation()
                        stepBarActiveIndex = 2
                    }
                    break;
            }
        }

        this.setData({ stepBarActiveIndex })

    },
    onRichTextInput(e) {
        // this.theData.richInputContent = e.detail;
        this.setData({ brief: e.detail })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onShow() {
        checkLogin(userInfo => this.theData.userInfo = userInfo)
    },
    // 选择社团图标
    async handleChooseIcon() {
        try {
            const tempFiles = await chooseImage()
            this.setData({ icon_url: tempFiles[0].path })
        } catch (error) {
            console.log(error);
        }

    },
    // 选择社团背景图
    async handleChooseBgcImg() {
        try {
            const tempFiles = await chooseImage()
            this.setData({ bgc_url: tempFiles[0].path })
        } catch (error) {
            console.log(error);
        }
    },
    // 创建社团
    async createAssociation() {
        // 上传社团图标和背景图片获取文件id
        const icon_file_id = await uploadCloudFile(`images/${createUniqueImgName()}_asso_icon.png`, this.data.icon_url)
        const bgc_file_id = await uploadCloudFile(`images/${createUniqueImgName()}_asso_bgc.png`, this.data.bgc_url)

        // 社团简介内容
        const html = this.data.brief.html
        const brief_file_maps = []
            // 上传社团简介内含有的背景图片
        for (let i = 0; i < this.data.brief.delta.ops.length; i++) {
            const ele = this.data.brief.delta.ops[i]
            if (ele.insert && ele.insert.image) {
                // 本地路径和远程id的对应关系
                const remote_file_id = await uploadCloudFile(`images/${createUniqueImgName()}_asso_brief_${i}.png`, ele.insert.image)
                brief_file_maps.push({ local: ele.insert.image, remote_file_id })
            }
        }

        // console.log({
        //     name: this.data.name,
        //     contact: this.data.contact,
        //     belong: this.data.belong,
        //     beief: { html, brief_file_maps },
        //     icon_file_id,
        //     bgc_file_id
        // });
        // 发送创建社团请求
        const res = await createAssociation(
            this.data.name,
            this.data.contact,
            this.data.belong, { html, brief_file_maps },
            icon_file_id,
            bgc_file_id, [this.theData.userInfo._id], this.theData.userInfo._id
        )
        if (!res.error) {
            const { asso_id, userInfo } = res.msg
            setUserInfo(userInfo)
            wx.redirectTo({
                url: '/pages/association/index?asso_id=' + asso_id
            });


        }

    }

})