// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()
const _ = db.command

// 消息数据表
const messageColl = db.collection('message')

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const { target_id, user_id, msg } = event
    const limit = event.limit || 20

    try {
        // 注册
        await messageColl.add({
            data: {
                sender: user_id,
                receiver: target_id,
                content: msg,
                create_time: new Date()
            }
        })

        // 重新查找消息记录
        const res = await messageColl.where({
            receiver: _.in([target_id, user_id]),
            sender: _.in([target_id, user_id])
        }).get()
        return {
            error: false,
            msg: res.data
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '操作失败'
        }
    }

}