import { setTempImg } from '../../utils/util.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: '',
        width: 200,
        height: 200,
        // 用于标识不同裁剪数据的标签（会写入缓存）
        tag: 'unset'

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options);
        // 获取传递过来的参数
        // const { imgSrc, width, height } = options
        this.setData(options)

    },
    // 点击取消
    handleCancel() {
        wx.navigateBack({ delta: 1 });
    },
    // 点击确定
    handleConfirm() {
        // 获取上一个页面
        let pages = getCurrentPages();

        // 获取并返回剪裁的结果
        this.selectComponent('#img_scopper').getImg((imgInfo) => {
            // console.log(imgInfo);
            // // 写入缓存
            setTempImg({ url: imgInfo.url, tag: this.data.tag })
            wx.navigateBack();

        });
    }
})