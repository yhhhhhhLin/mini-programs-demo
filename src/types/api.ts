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

}
