<template>
  <div class="home">
    <section class="actions-wrapper">
      <CommonCard title="配置选项" :show-footer="false">
        <div class="actions">
          <!-- 年份选择 -->
          <YearSelector label="年份选择" @change="onYearChange" />
          <!-- 颜色1选择（法定节假日） -->
          <ColorSelector
            label="颜色1选择（法定节假日）"
            :colors="COLORS"
            @change="(value) => onColorChange(1, value)"
          />
          <!-- 颜色2选择（调休、补休、周末连休） -->
          <ColorSelector
            label="颜色2选择（调休、补休、周末连休）"
            :colors="COLORS"
            @change="(value) => onColorChange(2, value)"
          />
          <!-- 颜色3选择（补班） -->
          <ColorSelector
            label="颜色3选择（补班）"
            :colors="COLORS"
            @change="(value) => onColorChange(3, value)"
          />
          <div class="actions-buttons">
            <a-button
              type="primary"
              :disabled="onCreateDisabled"
              @click="onCreate"
            >
              生成预览
            </a-button>
          </div>
        </div>
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
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import html2pdf from 'html2pdf.js'
import CommonCard from '@/components/CommonCard.vue'
import YearSelector from './components/YearSelector.vue'
import ColorSelector from './components/ColorSelector.vue'
import CommonEmpty from '@/components/CommonEmpty.vue'
import PlanPage from './components/PlanPage.vue'
import { getHolidaysFromYear } from '@/apis'
import { COLORS } from './constants/index'

const previewOptions = reactive<PreviewOptions>({
  year: '',
  color1: '',
  color2: '',
  color3: ''
})

function onYearChange(value: Dayjs) {
  previewOptions.year = dayjs(value).format('YYYY')
}

function onColorChange(type: number, value: string) {
  const key = `color${type}`
  previewOptions[key] = value
}

const onCreateDisabled = computed(() => {
  const { year, color1, color2, color3 } = previewOptions
  return !(year && color1 && color2 && color3)
})

const requestLoading = ref(false)

async function getHolidayPlanFromYear(year: string) {
  requestLoading.value = true
  try {
    const response = await getHolidaysFromYear(year)
    const { holiday, type: dateDetail } = response.data
    const holidayPlan: HolidayYearPlan = {}
    Object.keys(holiday).forEach((key) => {
      const [month, day] = key.split('-')
      if (!holidayPlan[month]) {
        holidayPlan[month] = {}
      }
      const { date, wage } = holiday[key]
      const { type, name, week } = dateDetail[date]
      holidayPlan[month][day] = { type, wage, week, desc: name }
    })
    return holidayPlan
  } catch (error) {
    console.error(error)
  } finally {
    requestLoading.value = false
  }
}

const holidayYearPlan = ref<HolidayYearPlan>({})

async function onCreate() {
  const { year } = previewOptions
  try {
    holidayYearPlan.value = (await getHolidayPlanFromYear(year)) || {}
    console.log('holidayYearPlan', holidayYearPlan.value)
    console.log('holidayYearPlan[01]', holidayYearPlan.value['01'])
  } catch (error) {
    console.error(error)
  }
}

const holidayMonths = computed(() => Object.keys(holidayYearPlan.value).sort())

const isEmpty = computed(() => Boolean(holidayMonths.value.length < 1))

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
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: row;

  .actions-wrapper {
    width: 300px;
    height: 100%;
    margin-right: 16px;

    .actions {
      padding: 0 16px;

      .actions-buttons {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 16px 0;
        display: flex;
        flex-direction: column;
      }
    }
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
