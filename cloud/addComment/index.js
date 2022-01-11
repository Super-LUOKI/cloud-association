// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 数据集合
const commentColl = db.collection('comment')

// 云函数入口函数
// 添加评论
exports.main = async(event, context) => {
    const { post_id, user_id, content } = event
    try {
        // 创建评论数据
        const commentRes = await commentColl.add({
            data: {
                post_id,
                user_id,
                content,
                create_time: new Date()
            }
        })
        return getResponseTemplate(false, 'ok')
    } catch (error) {
        console.log(error);
        return getResponseTemplate(true, '注册用户出错')
    }

}

// 获取响应模板
function getResponseTemplate(isError, msg) {
    return {
        error: isError,
        msg
    }
}