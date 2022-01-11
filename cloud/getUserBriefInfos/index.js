// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()
const _ = db.command

// 用户数据表
const userColl = db.collection('user')

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const { user_ids } = event

    try {
        const res = await userColl.where({
                _id: _.in(user_ids)
            }).get()
            // 过滤用户数据
        const newData = res.data.map(v => ({ _id: v._id, avatar_url: v.avatar_url, username: v.username }))
        return {
            error: false,
            msg: newData
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '获取失败'
        }
    }

}