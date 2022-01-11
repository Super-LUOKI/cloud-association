// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 集合
const assoColl = db.collection('association')
const userColl = db.collection('user')

// 云函数入口函数
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const {
        name,
        contact,
        belong,
        brief,
        icon_file_id,
        bgc_file_id,
        members,
        owner_id
    } = event

    // 判断该用户是否存在于数据库中
    const { data: tempAssos } = await assoColl.where({ name }).get()
    if (tempAssos.length === 0) {
        try {
            // 创建社团
            await assoColl.add({
                    data: {
                        name,
                        contact,
                        belong,
                        brief,
                        icon_file_id,
                        bgc_file_id,
                        members,
                        owner_id,
                        // 与该社团有关的所有帖子id列表
                        posts: [],
                        create_time: new Date()
                    }
                })
                // 重新获取社团信息
            const { data: association } = await assoColl.where({ name }).get()
                // 获取用户信息
            const { data: userInfos } = await userColl.where({ openid }).get()
            const assoList = userInfos[0].associations
            assoList.push(association[0]._id)
                // 更新用户信息
            await userColl.where({ openid }).update({
                    data: {
                        associations: assoList
                    }
                })
                // 重新获取用户信息
            const { data: newUserInfos } = await userColl.where({ openid }).get()
            return getResponseTemplate(false, { asso_id: association[0]._id, userInfo: newUserInfos[0] })
                // return getResponseTemplate(false, assoList)
        } catch (error) {
            console.log(error);
            return getResponseTemplate(error, '创建失败')
        }
    } else {
        // 提示已经创建过
        return getResponseTemplate(true, '已有同名社团')
    }

}


// 获取响应模板
function getResponseTemplate(isError, msg) {
    return {
        error: isError,
        msg
    }
}