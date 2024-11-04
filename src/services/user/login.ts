import request from "../../uitls/request";

export function getWxLoginId(code:string){
  return request({
    url: '/user/getWxLoginId/'+code,
    method: 'GET'
  })

}
