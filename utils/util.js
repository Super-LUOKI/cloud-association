// 获取本地用户信息
export const getUserInfo = () => {
    return wx.getStorageSync('userInfo');

}

// 设置本地用户信息
export const setUserInfo = (userInfo) => {
    return wx.setStorageSync('userInfo', userInfo);

}