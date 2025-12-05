<template>
  <div class="plan-detail">
    <section class="detail-header"></section>
    <section class="detail-table">
      <!-- thead -->
      <template v-for="theadCell in theadCells" :key="theadCell.label">
        <span :class="theadCell.className">{{ theadCell.labelText }}</span>
      </template>
      <!-- tbody -->
      <template v-for="tbodyCell in tbodyCells" :key="tbodyCell.key">
        <span :class="tbodyCell.className">{{ tbodyCell.labelText }}</span>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import dayjs from 'dayjs'

const props = withDefaults(
  defineProps<{
    year?: string
    month?: string
    monthPlan?: HolidayMonthPlan
  }>(),
  {
    year: '2026',
    month: '01',
    monthPlan: () => ({
      '01': {
        type: 2,
        wage: 3,
        week: 4,
        desc: '元旦'
      },
      '02': {
        type: 2,
        wage: 2,
        week: 5,
        desc: '元旦'
      },
      '03': {
        type: 2,
        wage: 2,
        week: 6,
        desc: '元旦'
      },
      '04': {
        type: 3,
        wage: 1,
        week: 7,
        desc: '元旦后补班'
      }
    })
  }
)

const theadLabels = reactive<string[]>([
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
])

const theadCells = computed(() => {
  return theadLabels.map((label) => {
    return { className: 'thead-cell', labelText: label }
  })
})

const tbodyCells = computed(() => {
  const cells = []
  const { year, month } = props
  const firstDay = dayjs(`${year}-${month}-01`)
  const daysCount = firstDay.daysInMonth()
  // 填充日期
  for (let i = 1; i < daysCount; i += 1) {
    const week = firstDay.date(i).day()
    cells.push({
      key: i,
      week: week === 0 ? 7 : week,
      className: 'tbody-cell',
      labelText: i
    })
  }
  // 填充空白
  const fIndex = 0
  const bFillCount = cells[fIndex].week - 1
  const bFillCells = new Array(bFillCount).fill(null).map((_, index) => ({
    key: 0 - index,
    className: 'tbody-cell',
    labelText: ''
  }))
  cells.unshift(bFillCells)
  const lIndex = cells.length - 1
  const aFillCount = 7 - cells[lIndex].week
  const aFillCells = new Array(aFillCount).fill(null).map((_, index) => ({
    key: lIndex + index + 1,
    className: 'tbody-cell',
    labelText: ''
  }))
  cells.push(aFillCells)
  return cells
})
</script>

<style lang="less" scoped>
.plan-detail {
  width: 100%;
  height: 100%;
  background-color: #e8e8e8;
  display: flex;
  flex-direction: column;

  .detail-table {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 2px;

    .thead-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ccc;
    }

    .tbody-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ccc;
    }
  }
}
</style>
