<template>
  <div class="plan-previewer" :class="{ empty: isEmpty }">
    <template v-if="isEmpty">
      <section class="previewer-empty">
        <CommonEmpty />
      </section>
    </template>
    <template v-else>
      <section class="previewer-content" ref="previewerContentRef">
        <template v-for="page in planPages" :key="page.key">
          <PlanPage
            :year="userOptions.year"
            :year-plan="holidayYearPlan"
            :months="page.months"
            :color1="userOptions.color1"
            :color2="userOptions.color2"
            :color3="userOptions.color3"
            ref="previewerPagesRef"
          />
        </template>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
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

const previewerContentRef = ref<HTMLElement | null>(null)

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
  const element = previewerContentRef.value
  if (element) {
    html2pdf().from(element).set(exportOptions).save()
  }
}

const previewerPagesRef = ref<InstanceType<typeof PlanPage>[] | null>(null)

function exportPNG() {
  if (previewerPagesRef.value) {
    previewerPagesRef.value.forEach((page) => {
      html2canvas(page.$el, {
        useCORS: true, // 允许跨域图片（关键！否则跨域图片会空白）
        scale: 2 // 放大2倍，提升导出图片清晰度
      })
        .then((canvas) => {
          // 将Canvas转换为图片URL
          const imgUrl = canvas.toDataURL('image/png') // 格式可选image/png或image/jpeg
          // 创建下载链接并触发下载
          const link = document.createElement('a')
          link.href = imgUrl
          link.download = `导出图片_${new Date().getTime()}.png` // 自定义文件名
          link.click()
          // 释放内存（可选）
          URL.revokeObjectURL(imgUrl)
        })
        .catch((err) => console.log(err))
    })
  }
}

defineExpose({
  exportPDF,
  exportPNG
})
</script>

<style lang="less" scoped>
.plan-previewer {
  width: 100%;
  min-width: calc(960px + 16px + 16px);
  height: auto;
  box-sizing: border-box;
  padding: 16px 0;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;

  &.empty {
    min-width: none;
    height: 100%;
    padding: 16px;
  }

  .previewer-empty {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
