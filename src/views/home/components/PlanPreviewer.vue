<template>
  <div class="plan-previewer">
    <section class="previewer-mainer">
      <div class="previewer-scroll">
        <div class="previewer-content" ref="contentRef">
          <template v-if="isEmpty">
            <CommonEmpty />
          </template>
          <template v-else></template>
        </div>
      </div>
    </section>
    <section class="previewer-footer">
      <span class="previewer-toolbar">
        <a-button shape="circle" size="large" :disabled="isEmpty">
          <template #icon>
            <span class="button-icon"><LeftOutlined /></span>
          </template>
        </a-button>
        <span class="page-count">{{ current }} / {{ total }}</span>
        <a-button shape="circle" size="large" :disabled="isEmpty">
          <template #icon>
            <span class="button-icon"><RightOutlined /></span>
          </template>
        </a-button>
      </span>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import CommonEmpty from '@/components/CommonEmpty.vue'
import { getElementWidth } from '@/utils/element'

const props = withDefaults(
  defineProps<{ options: PreviewOptions; plan: HolidayPlan }>(),
  {}
)

const holidayMonth = computed(() => Object.keys(props.plan))

const isEmpty = computed(() => holidayMonth.value.length < 1)

const contentRef = ref<HTMLElement | null>(null)

watch(
  () => isEmpty,
  (isEmpty) => {
    nextTick(() => {
      if (contentRef.value) {
        if (isEmpty) {
          contentRef.value.style.height = '100%'
        } else {
          const width = getElementWidth(contentRef.value)
          contentRef.value.style.height = `${(width * 904) / 1304}px`
        }
      }
    })
  },
  { immediate: true }
)

const current = ref(0)
const total = ref(0)
</script>

<style lang="less" scoped>
.plan-previewer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .previewer-mainer {
    flex: 1;
    position: relative;

    .previewer-scroll {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;

      .previewer-content {
        width: 100%;
        box-sizing: border-box;
        padding: 0 16px;
      }
    }
  }

  .previewer-footer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    .previewer-toolbar {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .button-icon {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .page-count {
        font-size: 18px;
        font-weight: normal;
      }
    }
  }
}
</style>
