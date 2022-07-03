

<template>
  <component
    :is="buttonComponent"
    :aria-label="ariaLabel"
    :class="classes"
    v-bind="$attrs"
  >
    &times;
  </component>
</template>


<script lang="ts" setup>
import { computed } from 'vue';
import { VA_NAMESPACE } from '../ts/constant';
import { TOAST_DEFAULT} from "../ts/propValidator"
import type { ClassNames, Button} from "../types/common"
import { getVueComponentFromObj } from "../ts/utils"


interface CloseButtonProps {
  component?: Button
  classNames?: ClassNames
  ariaLabel?: string
  showOnHover?: boolean
}


const props = withDefaults(defineProps<CloseButtonProps>(), {
  component: TOAST_DEFAULT.closeButton,
  classNames: TOAST_DEFAULT.closeButtonClassName,
  ariaLabel: TOAST_DEFAULT.accessibility()["closeButtonLabel"],
  showOnHover: TOAST_DEFAULT.showCloseButtonOnHover,
})


const buttonComponent = computed(() => {
  if(props.component !== false) {
    return getVueComponentFromObj(props.component)
  }

  return "button"
})


const classes = computed(() => {
  const classes = [`${VA_NAMESPACE}__close-button`]
  if(props.showOnHover) {
    classes.push("show-on-hover")
  }

  return classes.concat(props.classNames)
})
</script>