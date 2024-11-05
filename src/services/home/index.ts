import request from "../../uitls/request";

// export function userLogin(loginInfo: API.LoginUserInfo) {
//   return request({
//     url: '/main/user/login',
//     method: 'POST',
//     data: loginInfo,
//   })
// }
//
export function getCalendarsAndQuantities(year: number, month: number){
  return request({
    url: '/task/calendars',
    method: 'GET',
    data: {year, month},
  })

}
