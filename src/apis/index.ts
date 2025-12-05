import { get } from '@/utils/request'

export function getHolidaysFromYear(year: string) {
  /**
   * API 官网：https://timor.tech/api/holiday/
   */
  return get(`http://timor.tech/api/holiday/year/${year}`, {
    type: 'Y'
  })
}
