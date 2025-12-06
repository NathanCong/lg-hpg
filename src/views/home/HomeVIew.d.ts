type Day = {
  date: string // 具体日期
  type: number // 日期类型（0: 工作日，1: 周末，2: 节日，3: 调休）
  name: string // 日期名称
  desc: string // 日期描述（冗余字段）
  week: number // 一周中的第几天（1 ~ 7: 周一 ~ 周日）
  wage: number // 薪资倍数
}

type HolidayMonthPlan = Record<string, Day>

type HolidayYearPlan = Record<string, HolidayMonthPlan>
