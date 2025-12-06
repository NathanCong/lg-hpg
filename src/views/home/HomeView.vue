<template>
  <div class="home">
    <section class="options-wrapper">
      <CommonCard title="配置选项" :show-footer="false">
        <OptionsSelector @create="onCreate" />
      </CommonCard>
    </section>
    <section class="preview-wrapper">
      <CommonCard mode="full" title="预览计划" :show-footer="true">
        <CommonLoading :is-loading="requestLoading">
          <PlanPreviewer
            :user-options="userOptions"
            :holiday-year-plan="holidayYearPlan"
            ref="planPreviewerRef"
          />
        </CommonLoading>
        <template #footer>
          <div class="preview-footer">
            <a-button
              type="primary"
              :disabled="isExportDisabled"
              @click="onExportPDF"
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
import { CommonCard, CommonLoading } from '@/components/index'
import { OptionsSelector, PlanPreviewer } from './components/index'
import { getHolidaysFromYear } from '@/apis'
import { isLegalHoliday, getWageMultiple } from '@/utils/common'

const requestLoading = ref(false)

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
      // 设置 date、type、desc、week
      holidayPlan[month][day].date = date
      holidayPlan[month][day].type = type
      holidayPlan[month][day].desc = name
      holidayPlan[month][day].week = week
      // 设置 name
      let newName = ''
      if (isLegalHoliday(name, date) && !holidays.includes(name)) {
        // 法定节假日，不重复显示
        newName = name
        holidays.push(newName)
      }
      holidayPlan[month][day].name = newName
      // 设置 wage
      holidayPlan[month][day].wage = getWageMultiple(type, newName, date)
    })
    return holidayPlan
  } catch (error) {
    console.error(error)
  } finally {
    requestLoading.value = false
  }
}

const userOptions = reactive<UserOptions>({
  year: '',
  color1: '',
  color2: '',
  color3: ''
})

const holidayYearPlan = ref<HolidayYearPlan>({})

async function onCreate(userOptions: UserOptions) {
  const { year, color1, color2, color3 } = userOptions
  try {
    holidayYearPlan.value = (await getHolidayPlanFromYear(year)) || {}
    userOptions.year = year
    userOptions.color1 = color1
    userOptions.color2 = color2
    userOptions.color3 = color3
  } catch (error) {
    console.error(error)
  }
}

const isEmpty = computed(() => Object.keys(holidayYearPlan.value).length < 1)

const isExportDisabled = computed(() => requestLoading.value || isEmpty.value)

const planPreviewerRef = ref<InstanceType<typeof PlanPreviewer> | null>(null)

function onExportPDF() {
  planPreviewerRef.value?.exportPDF()
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
