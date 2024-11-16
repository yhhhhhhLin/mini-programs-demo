import request from "../../uitls/request";

export function addTaskTags(tagName :string){
  return request({
    url: '/taskTag/add',
    data: {
      tagName: tagName
    }
  })
}
