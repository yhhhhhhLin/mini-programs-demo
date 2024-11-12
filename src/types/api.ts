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
    taskContent: string,
    taskTime: Date,
    // TODO 后续添加发送这个参数
    needNotify: boolean
    notifyMethod: number
  }

  type QueryTaskDTO = {
    year: number,
    month: number,
    day: number
  }

  type TaskVO = {
    id: number,
    taskContent: string,
    taskTime: Date,
    taskStatus: number,
    needNotify: boolean
  }

  type TaskClassificationVO = {
    expiredTasks :TaskVO[],
    completedTasks:TaskVO[],
    incompleteTasks: TaskVO[]
  }

  type UpdateStatusDTO = {
    id: number,
    status: number
  }

}
