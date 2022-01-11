// 微信云函数相关的工具类

// 使用js高级语法（async await）
import regeneratorRuntime from '../lib/runtime/runtime.js'

/* 
    登录
    参数类型（通过微信获取用户信息api获取）
    userInfo{
    avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIvLGtP1tnDzqa360iaYTakiay2DjQ72mTaStia8vibGx1U4gT1EXt8qp6tSy2CUPwE3mQd5gh66Y190g/132"
    city: ""
    country: ""
    gender: 0
    language: "zh_CN"
    nickName: "微信昵称"
    province: ""
    }
    
*/
export const login = async(userInfo) => {
    return callCloudFunction('login', {
        username: userInfo.nickName,
        gender: userInfo.gender,
        avatar_url: userInfo.avatarUrl
    })
}

// 更新用户背景图片
export const updateUserBgImg = async(fileId) => {
    return callCloudFunction('updateUserBgImg', {
        file_id: fileId
    })
}

// 上传文件
export const uploadCloudFile = (cloudPath, filePath) => {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '请稍候',
        })
        wx.cloud.uploadFile({
            cloudPath: cloudPath, // 上传至云端的路径
            filePath: filePath, // 小程序临时文件路径
            success: res => resolve(res.fileID),
            fail: err => reject(err),
            complete: () => wx.hideLoading()
        })
    })
}



// 根据fileId换取文件临时链接
export const getTempUrlById = (fileID) => {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '请稍候',
        })
        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                resolve(res.fileList[0].tempFileURL)
            },
            fail: err => reject(err),
            complete: () => wx.hideLoading()
        })
    })
}

// 获取用户信息
export const getUserInfoById = async(user_id) => {
    return callCloudFunction('getUserInfoById', { user_id })
}

// 关注用户
/* 
target_id:被关注的用户id
is_follow:true为关注,false为解除关注
*/
export const follow = async(target_id, is_follow) => {
    return callCloudFunction('follow', { target_id, is_follow })
}

// 修改用户信息
export const updateUserInfo = async(modified_user_info) => {
    return callCloudFunction('updateUserInfo', { modified_user_info })
}

// 获取两个用户之间的聊天数据
export const getMessageRecord = async(user_id_1, user_id_2, limit) => {
    return callCloudFunction('getMessageRecord', { user_id_1, user_id_2, limit })
}

// 向特定的用户发送消息
export const sendMessage = async(target_id, user_id, msg, limit) => {
    return callCloudFunction('sendMessage', { target_id, user_id, msg, limit })
}

// 获取用户接收到的消息
export const getMessageList = async(user_id, limit) => {
    return callCloudFunction('getMessageList', { user_id, limit })
}

// 根据用户id数组获取简单用户信息数组
export const getUserBriefInfos = async(user_ids) => {
    return callCloudFunction('getUserBriefInfos', { user_ids })
}

// 根据社团id数组获取简单社团信息数组
export const getAssoBriefInfos = async(asso_ids) => {
    return callCloudFunction('getAssoBriefInfos', { asso_ids })
}

// 获取最热门社团的limit个社团
export const getHotAssoBriefInfos = async(limit) => {
    return callCloudFunction('getHotAssoBriefInfos', { limit })
}


// 创建社团
export const createAssociation = async(name, contact, belong, brief, icon_file_id, bgc_file_id, members, owner_id) => {
    return callCloudFunction('createAssociation', { name, contact, belong, brief, icon_file_id, bgc_file_id, members, owner_id })
}

// 获取社团信息
export const getAssociationById = async(asso_id) => {
    return callCloudFunction('getAssociationById', { asso_id })
}

// 获取帖子分类列表
export const getPostCategoryList = async() => {
    return callCloudFunction('getPostCategoryList', {})
}

// 创建帖子
export const createPost = async(title, content, author_id, part_id, type, asso_id) => {
    return callCloudFunction('createPost', { title, content, author_id, part_id, type, asso_id })
}

// 根据id获取帖子
export const getPostInfoById = async(post_id) => {
    return callCloudFunction('getPostInfoById', { post_id })
}

// 帖子阅读数量增加num
export const addViewCount = async(post_id, num) => {
    return callCloudFunction('addViewCount', { post_id, num })
}


// 帖子点赞数量增加num
export const addLikeCount = async(post_id, num) => {
    return callCloudFunction('addLikeCount', { post_id, num })
}

// 更新收藏帖子数据 state 为true则收藏，否则取消收藏
export const updateSingleUserCollect = async(post_id, state) => {
    return callCloudFunction('updateSingleUserCollect', { post_id, state })
}

// 添加评论
export const addComment = async(post_id, user_id, content) => {
    return callCloudFunction('addComment', { post_id, user_id, content })
}

// 通过帖子id获取评论内容
export const getCommentsByPostId = async(post_id) => {
    return callCloudFunction('getCommentsByPostId', { post_id })
}


// 通过分类id获取帖子列表（默认是时间降序排列）
/* 
cate_id:分类id
 skip:跳过多少条
 limit:获取多少条
*/
export const getPostListByCateId = async(cate_id, skip, limit) => {
    return callCloudFunction('getPostListByCateId', { cate_id, skip, limit })
}

// 通过帖子id数组获取帖子数据
export const getPostListByIds = async(ids) => {
    return callCloudFunction('getPostListByIds', { ids })
}


// 根据社团id获取其资讯帖子id列表
export const getAssoNoticePostIds = async(asso_id) => {
    return callCloudFunction('getAssoNoticePostIds', { asso_id })
}

// 根据社团id获取其活动帖子id列表
export const getAssoActivityPostIds = async(asso_id) => {
    return callCloudFunction('getAssoActivityPostIds', { asso_id })
}






// 调用微信云函数
function callCloudFunction(name, data) {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '请稍候',
        })
        wx.cloud.callFunction({
            name: name,
            data: data,
            success: (res) => {
                // 如果有逻辑错误则直接提示
                if (res.result.error) {
                    // 如果出现错误
                    wx.showToast({
                        title: res.result.msg,
                        icon: 'error',
                        duration: 2000
                    })
                    console.log('来自云服务器的错误信息', res.result.error);
                }

                resolve(res.result)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    })
}