<template>
  <div class="color-selector">
    <section class="selector-label">{{ label }}</section>
    <section class="selector-wrapper">
      <a-select :options="options">
        <template #option="{ value, label }">
          <span class="selector-option">
            <span class="option-color" :style="{ background: value }"></span>
            <span class="option-label">{{ label }}</span>
          </span>
        </template>
      </a-select>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ label?: string; colors?: string[] }>(),
  {
    label: 'ColorSelector',
    colors: () => [
      '#ff000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#ff00ff',
      '#00ffff'
    ]
  }
)

const options = computed(() =>
  props.colors.map((color) => ({ label: color, value: color }))
)
</script>

<style lang="less" scoped>
.color-selector {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  .selector-label {
    font-size: 14px;
    font-weight: normal;
    line-height: 32px;
  }

  .selector-wrapper {
    flex: 1;
  }
}
</style>
