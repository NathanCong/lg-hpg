<template>
  <div class="plan-previewer" :class="{ empty: isEmpty }">
    <template v-if="isEmpty">
      <CommonEmpty />
    </template>
    <template v-else>
      <div class="previewer-pages" ref="previewerPagesRef">
        <template v-for="page in planPages" :key="page.key">
          <PlanPage
            :year="userOptions.year"
            :year-plan="holidayYearPlan"
            :months="page.months"
            :color1="userOptions.color1"
            :color2="userOptions.color2"
            :color3="userOptions.color3"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import html2pdf from 'html2pdf.js'
import { CommonEmpty } from '@/components/index'
import PlanPage from './components/PlanPage.vue'

const props = withDefaults(
  defineProps<{ userOptions: UserOptions; holidayYearPlan: HolidayYearPlan }>(),
  {}
)

const planMonths = computed(() => Object.keys(props.holidayYearPlan).sort())

const isEmpty = computed(() => planMonths.value.length < 1)

const planPages = computed(() => {
  const pages = []
  for (let i = 0; i < planMonths.value.length; i += 4) {
    pages.push({
      key: i,
      months: planMonths.value.slice(i, i + 4)
    })
  }
  return pages
})

const previewerPagesRef = ref<HTMLElement | null>(null)

function exportPDF() {
  const { year } = props.userOptions
  const exportOptions = {
    margin: 0,
    filename: `${year}年节假日放假计划.pdf`,
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
  const element = previewerPagesRef.value
  if (element) {
    html2pdf().from(element).set(exportOptions).save()
  }
}

defineExpose({
  exportPDF
})
</script>

<style lang="less" scoped>
.plan-previewer {
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
</style>
