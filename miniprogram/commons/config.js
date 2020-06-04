export const userAuthKey = 's_user_token'
export const openidKey = 's_user_appid'
export const userInfoKey = 's_user_info'
export const apiHost = 'https://www.orangesoda.cn'
export const apis = {
    userLogin: '/ship-auth-server/oauth/token',
    userLogout: '/ship-auth-server/api/exit',
    getUserInfo: '/ship-api/api/user/findUserDetail',
    getUserList: '/ship-api/api/user/findPage',
    getUserDetail: '/ship-api/api/user/findById',
    getOpenidAndToken: '/ship-api/api/user/findOpenId'
}