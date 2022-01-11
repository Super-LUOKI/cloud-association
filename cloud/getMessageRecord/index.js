// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 消息数据表
const messageColl = db.collection('message')
const _ = db.command

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const { user_id_1, user_id_2 } = event
    const limit = event.limit || 20

    try {
        const res = await messageColl.where({
            receiver: _.in([user_id_1, user_id_2]),
            sender: _.in([user_id_1, user_id_2])
        }).limit(limit).get()
        return {
            error: false,
            msg: res.data
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '获取消息失败'
        }
    }

}