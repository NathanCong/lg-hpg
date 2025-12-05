type PreviewOptions = Record<string, string>

interface HolidayMonthPlan {
  [day: string]: {
    type: string // 0: 工作日 1: 周末 2: 节日 3: 调休
    name: string
    wage: string // 薪资倍数，3表示是3倍工资
  }
}

interface HolidayYearPlan {
  [month: string]: HolidayMonthPlan
}
