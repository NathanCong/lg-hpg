<template>
  <div class="home">
    <section class="actions-wrapper">
      <CommonCard title="配置选项">
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
        <!-- 生成预览 -->
        <a-button
          type="primary"
          class="actions-button"
          @click="onCreate"
          :disabled="onCreateDisabled"
        >
          生成预览
        </a-button>
        <a-button
          type="primary"
          class="actions-button"
          @click="onExport"
          :disabled="true"
        >
          确认导出
        </a-button>
      </CommonCard>
    </section>
    <section class="preview-wrapper">
      <CommonCard title="预览计划">
        <!-- 假期计划预览器 -->
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
import { getHolidaysFromYear } from '@/apis'

const previewOptions: Record<string, string> = reactive({
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

async function queryHolidaysFromYear(year: string) {
  requestLoading.value = true
  try {
    const holidays = await getHolidaysFromYear(year)
    console.log('holidays', holidays)
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

function onCreate() {
  const { year } = previewOptions
  queryHolidaysFromYear(year)
}

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

    .actions-button {
      width: 100%;
      margin-top: 16px;
    }
  }

  .preview-wrapper {
    flex: 1;
    height: 100%;
  }
}
</style>
