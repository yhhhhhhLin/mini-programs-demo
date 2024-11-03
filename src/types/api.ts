declare namespace API {

  type BaseResponse<T> = {
    code: number,
    data: T,
    message: string
  }

  type DailyTask = {
    date: number,
    count: number
  }

}
