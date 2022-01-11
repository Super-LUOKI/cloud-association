import Dialog from '../miniprogram_npm/@vant/weapp/dialog/dialog';

// 获取本地用户信息
export const getUserInfo = () => {
    return wx.getStorageSync('userInfo');

}

// 设置本地用户信息
export const setUserInfo = (userInfo) => {
    return wx.setStorageSync('userInfo', userInfo);

}

// 清空本地用户信息
export const removeUserInfo = () => {
    return wx.removeStorageSync('userInfo')

}

// 设置本地图片缓存（针对图片剪裁页面的数据传递）
export const setTempImg = (imgInfo) => {
    return wx.setStorageSync('imgInfo', imgInfo);
}

// 获取本地图片缓存
export const getTempImg = () => {
    return wx.getStorageSync('imgInfo');
}

// 清除本地图片缓存
export const removeTempImg = () => {
    return wx.removeStorageSync('imgInfo')

}

// 设置本地用户id列表（针对用户信息列表数据的页面传递）
export const setTempUserIds = (tempUserIds) => {
    return wx.setStorageSync('tempUserIds', tempUserIds);
}

// 获取本地用户id列表
export const getTempUserIds = () => {
    return wx.getStorageSync('tempUserIds');
}

// 清除本地用户id列表
export const removeTempUserIds = () => {
    return wx.removeStorageSync('tempUserIds')

}

// 设置本地用户id列表（针对用户信息列表数据的页面传递）
export const setTempNormalIds = (TempNormalIds) => {
    return wx.setStorageSync('TempNormalIds', TempNormalIds);
}


// 获取本地普通id列表（用于页面间数据传递）
export const getTempNormalIds = () => {
    return wx.getStorageSync('TempNormalIds');
}

// 清除本地普通id列表（用于页面间数据传递）
export const removeTempNormalIds = () => {
    return wx.removeStorageSync('TempNormalIds')

}

// 检测登录，已经登录执行操作，未登录则要求登录
export const checkLogin = (hasLoginCallback, cancelLoginCallback) => {
    // 如果没有登录则跳转到登录页面
    const userInfo = getUserInfo()

    if (!userInfo) {
        // 未登录
        Dialog.confirm({
                title: '提示',
                message: '登录才能继续操作，是否前往登录？',
            })
            .then(() => {
                // 跳转到登录页
                wx.redirectTo({ url: '/pages/login/index' });
            })
            .catch(() => {
                // 如果未传入回调则默认退出当前页面
                if (cancelLoginCallback) {
                    cancelLoginCallback()
                } else {
                    wx.navigateBack();
                }
            });
    } else {
        // 已经登录
        if (hasLoginCallback) hasLoginCallback(userInfo)
    }
}

// 产生随机图片名称
export const createUniqueImgName = () => {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    var number = now.getSeconds() % 43;
    var time = year + month + date + hour + minu;
    return time + "_" + number;
}

// 选择图片
export const chooseImage = (count = 1) => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                resolve(res.tempFiles)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

// 将html格式的问题转换成不含标签的纯文本
// char_limit:只返回结果的前char_limit个字符的字符串，末尾添加"...", -100则代表不截取
export const getTextFromHtml = (html, char_limit = -100) => {
    let regex = new RegExp('<[^<>]+>', 'g')
    let text = html.replace(regex, "")
    if (char_limit === -100) {
        return text
    } else {
        return (text.substring(0, char_limit) + '...')
    }
}

// 1.5秒小提示
export const showToast = (msg) => {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1500
    });

}