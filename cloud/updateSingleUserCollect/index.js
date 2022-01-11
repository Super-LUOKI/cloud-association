// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 用户信息表
const userColl = db.collection('user')

// 云函数入口函数
/* 
更新用户对帖子的收藏数据state为true为收藏 反之取消收藏
*/
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { post_id, state } = event

    try {
        // 获取用户信息
        const { data: oldUserInfos } = await userColl.where({ openid }).get()

        const collection = oldUserInfos[0].collection
        const index = collection.findIndex(v => v === post_id)

        if (state && index === -1) {
            collection.push(post_id)
        } else {
            collection.splice(index, 1)
        }
        // 更新用户信息
        await userColl.where({ openid }).update({
                data: { collection }
            })
            // 获取最新用户信息
        const { data: newUserInfos } = await userColl.where({ openid }).get()
        return {
            error: false,
            msg: newUserInfos[0]
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            msg: '操作失败'
        }
    }

}