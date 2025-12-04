<template>
  <div class="home">
    <section class="actions-wrapper">
      <CommonCard title="配置选项">
        <!-- 年份选择 -->
        <YearSelector label="年份选择" />
        <!-- 颜色选择（法定节假日） -->
        <!-- 颜色选择（调休、补休、周末连休） -->
        <!-- 颜色选择（补班） -->
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
import CommonCard from '@/components/CommonCard.vue'
import YearSelector from './components/YearSelector.vue'
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
  }

  .preview-wrapper {
    flex: 1;
    height: 100%;
  }
}
</style>
