<template>
  <div class="plan-detail">
    <section class="detail-header"></section>
    <section class="detail-table">
      <template v-for="theadCell in theadCells" :key="theadCell.label">
        <span :class="theadCell.className">{{ theadCell.labelText }}</span>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'

withDefaults(defineProps<{ month?: string; monthPlan?: HolidayPlan }>(), {
  month: '01',
  monthPlan: {
    '01': {
      type: 2,
      name: '元旦',
      wage: 3
    },
    '02': {
      type: 2,
      name: '元旦',
      wage: 2
    },
    '03': {
      type: 2,
      name: '元旦',
      wage: 2
    },
    '04': {
      type: 3,
      name: '元旦后补班',
      wage: 1
    }
  }
})

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
    return { labelText: label, className: 'thead-cell' }
  })
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
      background-color: #ccc;
    }
  }
}
</style>
