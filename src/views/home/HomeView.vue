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
            @change="(value) => onColorChange(1, value)"
          />
          <!-- 颜色2选择（调休、补休、周末连休） -->
          <ColorSelector
            label="颜色2选择（调休、补休、周末连休）"
            @change="(value) => onColorChange(2, value)"
          />
          <!-- 颜色3选择（补班） -->
          <ColorSelector
            label="颜色3选择（补班）"
            @change="(value) => onColorChange(3, value)"
          />
          <div class="actions-buttons">
            <a-button
              type="primary"
              @click="onCreate"
              :disabled="onCreateDisabled"
            >
              生成预览
            </a-button>
          </div>
        </div>
      </CommonCard>
    </section>
    <section class="preview-wrapper">
      <CommonCard mode="full" title="预览计划" :show-footer="true">
        <div class="preview">
          <PlanPreviewer :options="previewOptions" :plan="holidayPlan" />
        </div>
        <template #footer>
          <div class="preview-footer">
            <a-button
              type="primary"
              @click="onExport"
              :disabled="onExportDisabled"
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
import CommonCard from '@/components/CommonCard.vue'
import YearSelector from './components/YearSelector.vue'
import ColorSelector from './components/ColorSelector.vue'
import PlanPreviewer from './components/PlanPreviewer.vue'
import { getHolidaysFromYear } from '@/apis'

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

const requestLoading = ref(false)

async function getHolidayPlanFromYear(year: string) {
  requestLoading.value = true
  try {
    const response = await getHolidaysFromYear(year)
    const { holiday, type: dateDetail } = response.data
    const holidayPlan: HolidayPlan = {}
    Object.keys(holiday).forEach((key) => {
      const [month, day] = key.split('-')
      if (!holidayPlan[month]) {
        holidayPlan[month] = {}
      }
      const { date, wage } = holiday[key]
      const { type, name } = dateDetail[date]
      holidayPlan[month][day] = { type, name, wage }
    })
    return holidayPlan
  } catch (error) {
    console.error(error)
  } finally {
    requestLoading.value = false
  }
}

const onCreateDisabled = computed(() => {
  const { year, color1, color2, color3 } = previewOptions
  return !(year && color1 && color2 && color3)
})

const holidayPlan = ref<HolidayPlan>({})
async function onCreate() {
  const { year } = previewOptions
  try {
    holidayPlan.value = (await getHolidayPlanFromYear(year)) || {}
  } catch (error) {
    console.error(error)
  }
}

const onExportDisabled = computed(() => {
  return true
})

function onExport() {}
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
      height: 100%;
      box-sizing: border-box;
      padding: 0 16px;
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
