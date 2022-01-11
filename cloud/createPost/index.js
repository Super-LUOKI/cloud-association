// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 集合
const postColl = db.collection('post')
const userColl = db.collection('user')

// 云函数入口函数
// 返回帖子id
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const {
        title,
        content,
        author_id,
        part_id,
        type,
        asso_id
    } = event

    try {
        // 创建帖子
        const res = await postColl.add({
                data: {
                    title,
                    content,
                    author_id,
                    view_count: 0,
                    like_count: 0,
                    part_id,
                    type,
                    asso_id,
                    create_time: new Date()
                }
            })
            // 获取用户信息
        const { data: userInfos } = await userColl.where({ openid }).get()
        const workList = userInfos[0].works
        workList.push(res._id)
            // 更新用户信息
        await userColl.where({ openid }).update({
                data: {
                    works: workList
                }
            })
            // 重新获取用户信息
        const { data: newUserInfos } = await userColl.where({ openid }).get()
        return getResponseTemplate(false, { post_id: res._id, userInfo: newUserInfos[0] })
            // return getResponseTemplate(false, workList)
    } catch (error) {
        console.log(error);
        return getResponseTemplate(error, '创建失败')
    }

}


// 获取响应模板
function getResponseTemplate(isError, msg) {
    return {
        error: isError,
        msg
    }
}