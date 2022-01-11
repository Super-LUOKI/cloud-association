// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 数据表
const messageColl = db.collection('message')
const userColl = db.collection('user')

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const { user_id } = event
    const limit = event.limit || 20

    try {
        const res = await messageColl.where({
                receiver: user_id
            }).limit(limit).get()
            // 过滤消息,提取发送信息的用户
        res.data.sort((a, b) => {
            return (new Date(b.create_time).getTime()) - (new Date(a.create_time).getTime())
        })

        let msgBriefList = []
        for (let i = 0; i < res.data.length; i++) {
            let msg = res.data[i]
            if (msgBriefList.findIndex(v => v.sender === msg.sender) === -1) {
                const userInfoRes = await userColl.doc(msg.sender).get()
                msgBriefList.push({ userInfo: userInfoRes.data, brief: msg.content })
            }

        }
        // let user_ids
        return {
            error: false,
            msg: msgBriefList
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '获取消息失败'
        }
    }

}