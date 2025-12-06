type Day = {
  type: number // 0: 工作日 1: 周末 2: 节日 3: 调休
  name: string // 节日名称
  desc: string // 节日描述
  week: number // 一周中的第几天。值为 1 - 7，分别表示 周一 至 周日
  wage: number // 薪资倍数，3表示是3倍工资
}

type HolidayMonthPlan = Record<string, Day>

type HolidayYearPlan = Record<string, HolidayMonthPlan>
