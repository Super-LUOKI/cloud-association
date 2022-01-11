// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 数据表
const categoryColl = db.collection('category')

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    try {
        const res = await categoryColl.get()
        return {
            error: false,
            msg: res.data
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '获取分类失败'
        }
    }

}