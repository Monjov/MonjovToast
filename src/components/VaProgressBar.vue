


<template>
  <div ref="el" :style="style" :class="cpClass" />
</template>


<script lang="ts" setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue"
import { VA_NAMESPACE } from "../ts/constant";
import { TOAST_DEFAULT } from "../ts/propValidator";
import type { BaseToastOptions } from "../types/toast";



interface ProgressBarType {
  timeout?: BaseToastOptions['timeout']
  hideProgressBar?: BaseToastOptions['hideProgressBar']
  isRuning?: boolean
}


const emit = defineEmits(["close-toast"])
const props = withDefaults(defineProps<ProgressBarType>(), {
  hideProgressBar: TOAST_DEFAULT.hideProgressBar, 
  isRuning: false, 
  timeout: TOAST_DEFAULT.timeout
})


const el = ref<HTMLElement>()
const hasClass = ref<boolean>(true)


const style = computed(() => {
  return {
    animationDuration: `${props.timeout}ms`,
    animationPlayState: props.isRuning ? "running" : "paused",
    opacity: props.hideProgressBar ? 0 : 1,
  }
})


const cpClass = computed(() =>
  hasClass.value ? `${VA_NAMESPACE}__progress-bar` : ""
)


watch(() => props.timeout, () => {
  hasClass.value = false, 
  nextTick(() => (hasClass.value = true))
})


const animationEnded = () => emit("close-toast")

onMounted(() => {
  if(el.value) {
    el.value.addEventListener('animationend', animationEnded)
  }
})


onBeforeUnmount(() => {
  if(el.value) {
    el.value.removeEventListener('animationend', animationEnded)
  }
})


</script>