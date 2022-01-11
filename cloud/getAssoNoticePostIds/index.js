// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 数据表
const postColl = db.collection('post')


// 获取社团的资讯列表

exports.main = async(event, context) => {
    const { asso_id } = event

    try {
        const res = await postColl.where({ asso_id }).get()

        // 按照时间降序排列
        res.data.sort((a, b) => {
            return (new Date(b.create_time).getTime()) - (new Date(a.create_time).getTime())
        })
        let theRes = res.data.filter(v => v.type === 'notice')
        theRes = theRes.map(v => v._id)
        return {
            error: false,
            msg: theRes
        }
    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '获取失败'
        }
    }

}