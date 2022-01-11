// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 数据库
const db = cloud.database()

// 用户数据
const userColl = db.collection('user')

// 云函数入口函数
/* 
更新成则返回最新的用户信息，否返回错误信息
*/
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { target_id, is_follow } = event


    try {

        // 获取用户信息
        let { data: userInfo } = await userColl.where({ openid }).get()
        userInfo = userInfo[0]

        // 获取被关注用户信息
        const { data: targetInfo } = await userColl.doc(target_id).get()

        if (is_follow) {
            return await follow(userInfo, targetInfo)
        } else {
            return await cancelFollow(userInfo, targetInfo)
        }
        // return {
        //     error: false,
        //     msg: 'newUserInfo'
        // }

    } catch (error) {
        console.log(error);
        return {
            error: error,
            msg: '操作失败'
        }
    }

}

// 关注用户
async function follow(userInfo, targetInfo) {
    let targetFans = targetInfo.fans
    let userFollow = userInfo.follow

    // 更新被关注用户粉丝列表
    if (targetFans.findIndex(v => v === userInfo._id) === -1) {
        targetFans.push(userInfo._id)
    }

    // 更新用户的关注列表
    if (userFollow.findIndex(v => v === targetInfo._id) === -1) {
        userFollow.push(targetInfo._id)
    }

    // 更新数据库信息
    try {
        // 更新用户的关注列表
        await userColl.doc(userInfo._id).update({
            data: { follow: userFollow }
        })

        // // 更新目标用户粉丝列表
        await userColl.doc(targetInfo._id).update({ data: { fans: targetFans } })

        // 返回最新的用户信息
        const { data: newUserInfo } = await userColl.doc(userInfo._id).get()
        return {
            error: false,
            msg: newUserInfo
        }
    } catch (error) {
        return {
            error: error,
            msg: '关注用户失败'
        }
    }
}

// 取消关注用户
async function cancelFollow(userInfo, targetInfo) {
    let targetFans = targetInfo.fans
    let userFollow = userInfo.follow


    // 将用户id从被关注者的粉丝列表删除
    const fansIndex = targetFans.findIndex(v => v === userInfo._id)
    if (fansIndex > -1) {
        targetFans.splice(fansIndex, 1)
    }

    // 将被关注者id从用户的关注列表删除
    const followIndex = userFollow.findIndex(v => v === targetInfo._id)
    if (followIndex > -1) {
        userFollow.splice(followIndex, 1)
    }


    // 更新数据库信息
    try {
        // 更新用户的关注列表
        await userColl.doc(userInfo._id).update({ data: { follow: userFollow } })

        // 更新目标用户粉丝列表
        await userColl.doc(targetInfo._id).update({ data: { fans: targetFans } })

        // 返回最新的用户信息
        const { data: newUserInfo } = await userColl.doc(userInfo._id).get()
        return {
            error: false,
            msg: newUserInfo
        }
    } catch (error) {
        return {
            error: error,
            msg: '取消关注失败'
        }
    }
}