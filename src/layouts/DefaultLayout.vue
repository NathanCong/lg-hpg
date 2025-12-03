<template>
  <div class="default-layout">
    <!-- 布局顶部导航 -->
    <section class="layout-header">
      <CommonHeader title="LG" sub-title="放假计划生成器"></CommonHeader>
    </section>
    <!-- 布局内容主体 -->
    <section class="layout-mainer">
      <slot></slot>
    </section>
  </div>
</template>

<script lang="ts" setup>
import CommonHeader from '@/components/CommonHeader.vue'
</script>

<style lang="less" scoped>
.default-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .layout-header {
    width: 100%;
    height: 60px;
  }

  .layout-mainer {
    flex: 1;
    overflow-x: hidden;
  }
}
</style>
