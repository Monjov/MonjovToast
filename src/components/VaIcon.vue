

<template>
    <component :is="component" :class="iconClasses">
        {{ customIconChildren }}
    </component>
</template>




<script lang="ts" setup>
import { computed } from "vue"; 
import { TYPE, VA_NAMESPACE } from "../ts/constant";
import { TOAST_DEFAULT } from "../ts/propValidator";
import { 
    getVueComponentFromObj, 
    hasProp, 
    isToastContent, 
    isString,
    isNonEmptyString
} from "../ts/utils";
import { Icon } from "../types/common";



import ErrorIcon from "./icons/VaErrorIcon.vue"
import InfoIcon from "./icons/VaInfoIcon.vue"
import SuccessIcon from "./icons/VaSuccessIcon.vue"
import WarningIcon from "./icons/VaWarningIcon.vue"



interface IconProps {
    type?: TYPE
    customIcon?: Icon
}


const props = withDefaults(defineProps<IconProps>(), {
    customIcon: TOAST_DEFAULT.icon, 
    type: TYPE.DEFAULT
})


const trimValue =   (value: unknown, empty = "") => {
      return isNonEmptyString(value) ? value.trim() : empty
}

const customIconChildren = computed(() => {
    return hasProp(props.customIcon, "iconChildren") ? trimValue(props.customIcon.iconChildren) : ""
})



const customIconClass = computed(() => {
  if (isString(props.customIcon)) {
    return trimValue(props.customIcon)
  } else if (hasProp(props.customIcon, "iconClass")) {
    return trimValue(props.customIcon.iconClass)
  }


  return ""
})



const hasCustomIcon = computed(() => {
  return customIconClass.value.length > 0
})


const component = computed(() => {
    if(hasCustomIcon.value){
        return customIconTag.value
    }

    if(isToastContent(props.customIcon)) {
        return getVueComponentFromObj(props.customIcon)
    }

    return iconTypeComponent.value
})

const iconTypeComponent = computed(() => {
    const types = {
        [TYPE.DEFAULT]: InfoIcon,
        [TYPE.INFO]: InfoIcon,
        [TYPE.ERROR]: ErrorIcon, 
        [TYPE.WARNING]: WarningIcon, 
        [TYPE.SUCCESS]: SuccessIcon
    }

    return types[props.type]
})


const customIconTag = computed(() => {
  if (hasProp(props.customIcon, "iconTag")) {
    return trimValue(props.customIcon.iconTag, "i")
  }
  return "i"
})



const iconClasses = computed(() => {
     const classes = [`${VA_NAMESPACE}__icon`]
     if(hasCustomIcon.value) {
        return classes.concat(customIconClass.value)
     }

     return classes
})


</script>