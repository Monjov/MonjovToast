

<template>
  <div ref="el" :class="classes" @click="clickHandler">
    <Icon v-if="icon" :custom-icon="icon" :type="type" />
    <div :role="accessibility.toastRole || 'alert'" :class="bodyClasses">
      <template v-if="typeof content === 'string'">{{ content }}</template>
      <component
        :is="getVueComponentFromObj(content)"
        v-else
        :toast-id="id"
        v-bind="getProp(content, 'props', {})"
        v-on="getProp(content, 'listeners', {})"
        @close-toast="closeToast"
      />
    </div>
    <CloseButton
      v-if="!!closeButton"
      :component="closeButton"
      :class-names="closeButtonClassName"
      :show-on-hover="showCloseButtonOnHover"
      :aria-label="accessibility.closeButtonLabel"
      @click.stop="closeToast"
    />
    <ProgressBar
      v-if="timeout"
      :is-running="isRuning"
      :hide-progress-bar="hideProgressBar"
      :timeout="timeout"
      @close-toast="closeToast"
    />
  </div>
</template>


<script lang="ts" setup>

import { computed, nextTick, ref, watch } from "vue";
import { EVENTS, TYPE, VA_NAMESPACE } from "../ts/constant";
import { TOAST_DEFAULT } from "../ts/propValidator";
import { ToastOptionsAndContent } from "../types/toast";
import  { useDraggable } from "../composable/useDraggable"
import  { useHoverable} from "../composable/useHoverable"
import { useFocusable} from "../composable/useFocusable"
import { isString, getProp, getVueComponentFromObj} from "../ts/utils";



import CloseButton from "./VaCloseButton.vue"
import Icon from "./VaIcon.vue"
import ProgressBar from "./VaProgressBar.vue"

interface ToastProps {
  content: ToastOptionsAndContent["content"]
  id?: ToastOptionsAndContent["id"]
  accessibility?: ToastOptionsAndContent["accessibility"]
  bodyClassName?: ToastOptionsAndContent["bodyClassName"]
  closeButton?: ToastOptionsAndContent["closeButton"]
  closeButtonClassName?: ToastOptionsAndContent["closeButtonClassName"]
  closeOnClick?: ToastOptionsAndContent["closeOnClick"]
  draggable?: ToastOptionsAndContent["draggable"]
  draggablePercent?: ToastOptionsAndContent["draggablePercent"]
  eventBus?: ToastOptionsAndContent["eventBus"]
  hideProgressBar?: ToastOptionsAndContent["hideProgressBar"]
  icon?: ToastOptionsAndContent["icon"]
  //?  PluginOptions[ToastOptionsAndContent
  onClick?: ToastOptionsAndContent["onClick"]
  //?  PluginOptions[ToastOptionsAndContent
  onClose?: ToastOptionsAndContent["onClose"]
  pauseOnFocusLoss?: ToastOptionsAndContent["pauseOnFocusLoss"]
  pauseOnHover?: ToastOptionsAndContent["pauseOnHover"]
  position?: ToastOptionsAndContent["position"]
  rtl?: ToastOptionsAndContent["rtl"]
  showCloseButtonOnHover?: ToastOptionsAndContent["showCloseButtonOnHover"]
  timeout?: ToastOptionsAndContent["timeout"]
  toastClassName?: ToastOptionsAndContent["toastClassName"]
  type?: ToastOptionsAndContent["type"]
}


const props = withDefaults(defineProps<ToastProps>(), {
  id: 0,
  accessibility: TOAST_DEFAULT.accessibility,
  bodyClassName: TOAST_DEFAULT.bodyClassName,
  closeButton: TOAST_DEFAULT.closeButton,
  closeButtonClassName: TOAST_DEFAULT.closeButtonClassName,
  closeOnClick: TOAST_DEFAULT.closeOnClick,
  draggable: TOAST_DEFAULT.draggable,
  draggablePercent: TOAST_DEFAULT.draggablePercent,
  eventBus: TOAST_DEFAULT.eventBus,
  hideProgressBar: TOAST_DEFAULT.hideProgressBar,
  icon: TOAST_DEFAULT.icon,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  pauseOnFocusLoss: TOAST_DEFAULT.pauseOnFocusLoss,
  pauseOnHover: TOAST_DEFAULT.pauseOnHover,
  position: TOAST_DEFAULT.position,
  rtl: TOAST_DEFAULT.rtl,
  showCloseButtonOnHover: TOAST_DEFAULT.showCloseButtonOnHover,
  timeout: TOAST_DEFAULT.timeout,
  toastClassName: TOAST_DEFAULT.toastClassName,
  type: TYPE.DEFAULT,
})


const el = ref<HTMLElement>()


const { hovering } = useHoverable(el, props)
const { focused } = useFocusable(el, props)
const { beingDragged, dragComplete } = useDraggable(el, props)


const isRuning = computed(() => {
  !hovering.value && focused.value && !beingDragged.value
})


const closeToast = () => {
  props.eventBus.emit(EVENTS.DISMISS, props.id)
}


const clickHandler = () => {
  if(!beingDragged.value){
    if(props.onClick) {
      props.onClick(closeToast)
    }


    if(props.closeOnClick) {
      closeToast()
    }
  }
}



watch(dragComplete, v => {
  if(v) {
    nextTick(() => closeToast())
  }
})


const classes = computed(() => {
    const classes = [
    `${VA_NAMESPACE}__toast`,
    `${VA_NAMESPACE}__toast--${props.type}`,
    `${props.position}`,
  ].concat(props.toastClassName)


  if(dragComplete.value) {
    classes.push("disable-transition")
  }

  if(props.rtl) {
    classes.push(`${VA_NAMESPACE}__toast--rtl`)
  }

  return classes; 
})


const bodyClasses = computed(() => {
  [
    `${VA_NAMESPACE}__toast-${
        isString(props.content) ? "body" : "component-body"
      }`,
  ].concat(props.bodyClassName)
})

</script>