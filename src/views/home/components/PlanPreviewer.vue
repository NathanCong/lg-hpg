<template>
  <div class="plan-previewer">
    <template v-if="isEmpty">
      <CommonEmpty />
    </template>
    <template v-else>
      <div class="previewer-pages">
        <PlanPage />
        <PlanPage />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import CommonEmpty from '@/components/CommonEmpty.vue'
import PlanPage from './PlanPage.vue'

const props = withDefaults(
  defineProps<{ options: PreviewOptions; plan: HolidayPlan }>(),
  {}
)

const holidayMonth = computed(() => Object.keys(props.plan))

const isEmpty = computed(() => !Boolean(holidayMonth.value.length < 1))
</script>

<style lang="less" scoped>
.plan-previewer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
