// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 数据表
const postColl = db.collection('post')


// 通过分类id获取帖子列表（默认是时间降序排列）
/* 
cate_id:分类id
 skip:跳过多少条
 limit:获取多少条
*/
exports.main = async(event, context) => {
    const { cate_id, skip, limit } = event

    try {
        const res = await postColl.where({
            part_id: cate_id
        }).skip(skip).limit(limit).get()

        // 按照时间降序排列
        res.data.sort((a, b) => {
            return (new Date(b.create_time).getTime()) - (new Date(a.create_time).getTime())
        })

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