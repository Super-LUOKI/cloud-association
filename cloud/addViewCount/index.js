// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 用户信息表
const postColl = db.collection('post')

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const { post_id, num } = event

    try {
        const { data: postInfo } = await postColl.doc(post_id).get()
        await postColl.doc(post_id).update({
            data: { view_count: postInfo.view_count + num }
        })
        return {
            error: false,
            msg: 'success'
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            msg: 'view_count fail'
        }
    }

}