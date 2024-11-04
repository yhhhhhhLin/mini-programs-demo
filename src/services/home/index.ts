import request from "../../uitls/request";

// export function userLogin(loginInfo: API.LoginUserInfo) {
//   return request({
//     url: '/main/user/login',
//     method: 'POST',
//     data: loginInfo,
//   })
// }
//
export function getCalendarsAndQuantities(){
  return request({
    url: '/home/user/calendars',
    method: 'GET'
  })

}
