<template>
  <div class="common-card">
    <section class="card-header">{{ title }}</section>
    <section class="card-mainer">
      <slot></slot>
    </section>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ title?: string }>(), { title: 'CommonCard' })
</script>

<style lang="less" scoped>
.common-card {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 16px;
  padding-top: 0;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .card-header {
    font-size: 16px;
    font-weight: bold;
    padding: 16px 0;
  }

  .card-mainer {
    flex: 1;
  }
}
</style>
