// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 用户数据表
const commentColl = db.collection('comment')

// 云函数入口函数
/* 
获取评论信息数组
*/
exports.main = async(event, context) => {
    const { post_id } = event

    try {
        const res = await commentColl.where({ post_id }).get()
        return {
            error: false,
            msg: res.data
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '获取失败'
        }
    }

}