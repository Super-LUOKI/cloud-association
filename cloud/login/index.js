// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { username, gender, avatar_url } = event
    console.log(openid);
    // 获取用户信息集合
    const userColl = db.collection('user')

    // 判断该用户是否存在于数据库中
    const { data: tempUsers } = await userColl.where({ openid }).get()
    if (tempUsers.length === 0) {
        try {
            // 注册
            const result = await userColl.add({
                data: {
                    username,
                    gender,
                    avatar_url,
                    bg_file_id: '',
                    openid,
                    province: { code: '-1', name: '未知' },
                    city: { code: '-1', name: '未知' },
                    district: { code: '-1', name: '未知' },
                    university: { code: '-1', name: '未知' },
                    associations: [],
                    brief: '暂无小简介~',
                    works: [],
                    fans: [],
                    follow: [],
                    collection: [],
                    create_time: new Date()
                }
            })
            const { data: userInfos } = await userColl.where({ openid }).get()
            return getResponseTemplate(false, userInfos[0])
        } catch (error) {
            console.log(error);
            return getResponseTemplate(true, '注册用户出错')
        }
    } else {
        // 用户登录
        return getResponseTemplate(false, tempUsers[0])
    }

}

// 获取用户信息(真机无效)
async function getUserInfoById(userId) {
    const { data } = await userColl.where({ _id: userId }).get()
    return data
}
// 获取响应模板
function getResponseTemplate(isError, msg) {
    return {
        error: isError,
        msg
    }
}