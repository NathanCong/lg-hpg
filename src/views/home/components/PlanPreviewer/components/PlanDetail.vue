<template>
  <div class="plan-detail">
    <section class="detail-header">
      <span class="header-month">{{ month }}月</span>
      <span class="header-desc"></span>
    </section>
    <section class="detail-table">
      <!-- thead -->
      <template v-for="theadCell in theadCells" :key="theadCell.key">
        <span :class="theadCell.className">{{ theadCell.text }}</span>
      </template>
      <!-- tbody -->
      <template v-for="tbodyCell in tbodyCells" :key="tbodyCell.key">
        <span
          :class="tbodyCell.className"
          :style="{ backgroundColor: tbodyCell.bgColor }"
        >
          <span class="cell-text" :style="{ color: tbodyCell.textColor }">
            {{ tbodyCell.text }}
          </span>
          <span class="cell-desc">{{ tbodyCell.desc }}</span>
        </span>
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
    color1?: string
    color2?: string
    color3?: string
  }>(),
  {
    year: '',
    month: '',
    monthPlan: () => ({}),
    color1: '',
    color2: '',
    color3: ''
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

const theadCells = computed<TheadCell[]>(() => {
  return theadLabels.map((text, index) => {
    return { key: index, text, className: 'thead-cell' }
  })
})

function getTbodyCellBgColor(type: number, wage: number) {
  // Type 3 代表补班，使用 color3
  if (type === 3) {
    return props.color3
  }
  // Type 2 代表假期
  if (type === 2) {
    // wage 3 代表3倍薪资，使用 color1
    if (wage === 3) {
      return props.color1
    }
    // wage 2 代表2倍薪资，使用 color2
    if (wage === 2) {
      return props.color2
    }
  }
  return '#fafafa'
}

const tbodyCells = computed<TbodyCell[]>(() => {
  const cells: TbodyCell[] = []
  const { year, month, monthPlan } = props
  const firstDay = dayjs(`${year}-${month}-01`)
  const daysCount = firstDay.daysInMonth()
  // 填充日期
  for (let i = 1; i <= daysCount; i += 1) {
    const week = firstDay.date(i).day()
    const key = String(i).length > 1 ? `${i}` : `0${i}`
    const { type, name, wage } = monthPlan[key] || {}
    cells.push({
      key: i,
      text: String(i),
      className: 'tbody-cell',
      week: week === 0 ? 7 : week,
      desc: name,
      bgColor: getTbodyCellBgColor(type, wage),
      textColor: week === 0 || week === 6 ? 'red' : '#333'
    })
  }
  // 填充头部空白
  const fIndex = 0
  const fCell = cells[fIndex]
  const bFillCount = fCell ? fCell.week - 1 : 0
  const bFillCells = new Array(bFillCount).fill(null).map((_, index) => ({
    key: 0 - index,
    text: '',
    className: 'tbody-cell',
    week: index + 1
  }))
  cells.unshift(...bFillCells)
  // 填充尾部空白
  const lIndex = cells.length - 1
  const aFillCount = 7 - cells[lIndex].week
  const aFillCells = new Array(aFillCount).fill(null).map((_, index) => ({
    key: lIndex + index + 1,
    text: '',
    className: 'tbody-cell',
    week: 7 - aFillCount + index + 1
  }))
  cells.push(...aFillCells)
  return cells
})
</script>

<style lang="less" scoped>
.plan-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .detail-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 8px;

    .header-month {
      color: #b9000d;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .detail-table {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 2px;
    background-color: #eee;

    .thead-cell,
    .tbody-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thead-cell {
      background-color: #d6dded;
      font-size: 14px;
      font-weight: bold;
    }

    .tbody-cell {
      flex-direction: column;

      .cell-text {
        font-size: 14px;
        line-height: 14px;
      }

      .cell-desc {
        margin-top: 2px;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
</style>
