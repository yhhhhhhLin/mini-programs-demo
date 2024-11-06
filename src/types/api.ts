declare namespace API {

  type BaseResponse<T> = {
    code: number,
    data: T,
    message: string
  }

  type DayAndCountVO = {
    date: string,
    count: number
  }

  type AddTaskDTO = {
    taskContent:string,
    taskTime: Date,
    // TODO 后续添加发送这个参数
    needNotify: boolean

  }

}
