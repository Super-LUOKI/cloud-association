// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { file_id } = event

    // 更新用户数据
    const userColl = db.collection('user')
    try {
        await userColl.where({ openid }).update({
                data: { bg_file_id: file_id }
            })
            // 获取最新用户信息
        const { data } = await userColl.where({ openid }).get()
        return {
            error: false,
            msg: data[0]
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            msg: '更新背景图片失败'
        }
    }

}