import request from "../../uitls/request";
// export function userLogin(loginInfo: API.LoginUserInfo) {
//   return request({
//     url: '/main/user/login',
//     method: 'POST',
//     data: loginInfo,
//   })
// }
//
export function getCalendarsAndQuantities(year: number, month: number) {
  return request({
    url: '/task/calendars',
    method: 'GET',
    data: {year, month},
  })

}

export function addTask(dto: API.AddTaskDTO) {
  return request({
    url: '/task/add',
    method: 'POST',
    data: dto,
  })
}

export function listTask(dto: API.QueryTaskDTO): Promise<API.BaseResponse<API.TaskClassificationVO>> {
  return request({
    url: '/task/list',
    method: "POST",
    data: dto,
  })
}

export function updateTaskStatus(dto: API.UpdateStatusDTO){
  return request({
    url: '/task/status',
    method: 'POST',
    data: dto,
  })
}
