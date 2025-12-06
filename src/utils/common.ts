/**
 * 是否法定节假日
 * @param dateName 日期名称
 * @param date     日期
 */
export function isLegalHoliday(dateName: string, date: string): boolean {
  // 元旦 -	法定日期: 1 月 1 日
  if (date.includes('01-01')) {
    return true
  }
  // 春节 - 法定日期: 农历除夕, 正月初一, 正月初二, 正月初三
  if (['除夕', '初一', '初二', '初三'].includes(dateName)) {
    return true
  }
  // 清明节 - 法定日期: 农历清明当日
  if (dateName.includes('清明')) {
    return true
  }
  // 劳动节 - 法定日期: 5 月 1 日、5 月 2 日
  if (date.includes('05-01') || date.includes('05-02')) {
    return true
  }
  // 端午节 - 法定日期: 农历端午当日
  if (dateName.includes('端午')) {
    return true
  }
  // 中秋节 - 法定日期: 农历中秋节当日
  if (dateName.includes('中秋')) {
    return true
  }
  // 国庆节 - 法定日期：10 月 1 日、10 月 2 日、10 月 3 日
  if (
    date.includes('10-01') ||
    date.includes('10-02') ||
    date.includes('10-03')
  ) {
    return true
  }
  return false
}

/**
 * 计算工资倍数
 * @param dateType 日期类型（0: 工作日，1: 周末，2: 节日，3: 调休）
 * @param dateName 日期名称
 * @param date     日期
 */
export function getWageMultiple(
  dateType: number,
  dateName: string,
  date: string
) {
  // 假期 2 倍薪资起
  if (dateType === 2) {
    // 法定节假日 3 倍薪资
    if (isLegalHoliday(dateName, date)) {
      return 3
    }
    // 其他情况 2 倍薪资
    return 2
  }
  // 非假期 1 倍薪资
  return 1
}
