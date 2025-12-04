<template>
  <div class="plan-page">
    <section class="page-header">
      {{ year }} 年 LG CNS 根据国家规定的节假日放假计划
    </section>
    <section class="page-mainer"></section>
    <section class="page-footer">
      <img class="page-logo" :src="LogoPNG" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import LogoPNG from '@/assets/images/logo.png'

withDefaults(
  defineProps<{
    year?: string
    color1?: string
    color2?: string
    color3?: string
  }>(),
  {
    year: 'year'
  }
)
</script>

<style lang="less" scoped>
.plan-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;

  .page-header {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px 0;
    font-size: 28px;
    line-height: 32px;
    font-weight: bold;
    border-bottom: 4px solid gray;
  }

  .page-mainer {
    flex: 1;
  }

  .page-footer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .page-logo {
      width: auto;
      height: 30px;
    }
  }
}
</style>
