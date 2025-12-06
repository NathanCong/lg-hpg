<template>
  <div class="home">
    <section class="options-wrapper">
      <CommonCard title="配置选项" :show-footer="false">
        <OptionsSelector @create="onCreate" />
      </CommonCard>
    </section>
    <section class="preview-wrapper">
      <CommonCard mode="full" title="预览计划" :show-footer="true">
        <div class="preview" :class="{ empty: isEmpty }">
          <template v-if="isEmpty">
            <CommonEmpty />
          </template>
          <template v-else>
            <div class="previewer-pages">
              <template v-for="pages in previewerPages" :key="pages.key">
                <PlanPage
                  :year="previewOptions.year"
                  :year-plan="holidayYearPlan"
                  :months="pages.months"
                  :color1="previewOptions.color1"
                  :color2="previewOptions.color2"
                  :color3="previewOptions.color3"
                />
              </template>
            </div>
          </template>
        </div>
        <template #footer>
          <div class="preview-footer">
            <a-button
              type="primary"
              :disabled="onExportDisabled"
              @click="onExport"
            >
              导出PDF
            </a-button>
          </div>
        </template>
      </CommonCard>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import { CommonCard, CommonEmpty } from '@/components/index'
import { OptionsSelector } from './components/index'
import PlanPage from './components/PlanPage.vue'
import { getHolidaysFromYear } from '@/apis'

const requestLoading = ref(false)

/**
 * 获取工资倍数
 */
function getWage(date: string, desc: string, type: number) {
  // 元旦 -	法定日期: 1 月 1 日
  if (date.includes('01-01')) {
    return 3
  }
  // 春节 - 法定日期: 农历除夕, 正月初一, 正月初二, 正月初三
  if (['除夕', '初一', '初二', '初三'].includes(desc)) {
    return 3
  }
  // 清明节 - 法定日期: 农历清明当日
  if (desc.includes('清明')) {
    return 3
  }
  // 劳动节 - 法定日期: 5 月 1 日、5 月 2 日
  if (date.includes('05-01') || date.includes('05-02')) {
    return 3
  }
  // 端午节 - 法定日期: 农历端午当日
  if (desc.includes('端午')) {
    return 3
  }
  // 中秋节 - 法定日期: 农历中秋节当日
  if (desc.includes('中秋')) {
    return 3
  }
  // 国庆节 - 法定日期：10 月 1 日、10 月 2 日、10 月 3 日
  if (
    date.includes('10-01') ||
    date.includes('10-02') ||
    date.includes('10-03')
  ) {
    return 3
  }
  // 非法定节假日，但是假期中，2倍薪资
  if (type === 2) {
    return 2
  }
  // 不是假期，1倍薪资
  return 1
}

async function getHolidayPlanFromYear(year: string) {
  requestLoading.value = true
  try {
    const response = await getHolidaysFromYear(year)
    const { holiday, type: dateDetail } = response.data
    const holidayPlan: HolidayYearPlan = {}
    const holidays: string[] = []
    Object.keys(holiday).forEach((key) => {
      const [month, day] = key.split('-')
      if (!holidayPlan[month]) {
        holidayPlan[month] = {}
      }
      const { date } = holiday[key]
      const { type, name, week } = dateDetail[date]
      // 生成 desc
      let desc = name
      if (type === 2 && holidays.includes(name)) {
        // 法定节假日重复出现，不重复显示
        desc = ''
      }
      if (type === 2 && !holidays.includes(name)) {
        // 法定节假日第一次出现（当天），需要显示
        desc = name
        holidays.push(name)
      }
      if (type === 3) {
        // 补班信息，统一显示
        desc = '补班'
      }
      holidayPlan[month][day] = {
        type,
        week,
        desc,
        wage: getWage(date, desc, type)
      }
    })
    return holidayPlan
  } catch (error) {
    console.error(error)
  } finally {
    requestLoading.value = false
  }
}

const previewOptions = reactive<PreviewOptions>({
  year: '',
  color1: '',
  color2: '',
  color3: ''
})

const holidayYearPlan = ref<HolidayYearPlan>({})

async function onCreate(userOptions: UserOptions) {
  const { year, color1, color2, color3 } = userOptions
  previewOptions.year = year
  previewOptions.color1 = color1
  previewOptions.color2 = color2
  previewOptions.color3 = color3
  holidayYearPlan.value = {}
  try {
    holidayYearPlan.value = (await getHolidayPlanFromYear(year)) || {}
  } catch (error) {
    console.error(error)
  }
}

const holidayMonths = computed(() => Object.keys(holidayYearPlan.value).sort())

const isEmpty = computed(() => holidayMonths.value.length < 1)

const onExportDisabled = computed(() => isEmpty.value)

const previewerPages = computed(() => {
  const pages = []
  const months = holidayMonths.value
  for (let i = 0; i < months.length; i += 4) {
    pages.push({
      key: i,
      months: months.slice(i, i + 4)
    })
  }
  return pages
})

function onExport() {
  const element: HTMLElement | null = document.querySelector('.previewer-pages')
  const options = {
    margin: 0,
    filename: `${previewOptions.year}年节假日放假计划.pdf`,
    image: {
      type: 'jpeg' as const,
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: 'px', // 页面宽高单位
      format: [960, 720] as [number, number], // 单页宽高：960 * 720
      orientation: 'landscape' as const // 页面方向：纵向（portrait），横向（landscape）
    }
  }
  if (element) {
    html2pdf().from(element).set(options).save()
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background-color: #ddd;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: row;

  .options-wrapper {
    width: 300px;
    height: 100%;
    margin-right: 16px;
  }

  .preview-wrapper {
    flex: 1;

    .preview {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 16px 0;
      background-color: #e8e8e8;
      display: flex;
      justify-content: center;

      &.empty {
        height: 100%;
      }
    }

    .preview-footer {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 16px;
      padding-top: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
