


<template>
    <transition-group
        type="animation"
        tag="div"
        :enter-active-class="getProp(transition, 'enter', `${transition}-enter-active`)"
        :move-class="getProp(transition, 'move', `${transition}-move`)"
        :leave-active-class="getProp(transition, 'leave', `${transition}-leave-active`)"
        @leave="leave"
    >
        <slot></slot>
    </transition-group>
</template>




<script lang="ts" setup>
import { TOAST_CONTAINER_DEFAULTS } from "../ts/propValidator";
import { BaseToastContainerOptions } from "../types/toastContainer";
import { getProp } from "../ts/utils"

interface TransitionProps {
    transition?: BaseToastContainerOptions['transition']
}


defineEmits(["leave"])


withDefaults(defineProps<TransitionProps>(), {
    transition: TOAST_CONTAINER_DEFAULTS.transition
})



const leave = (el: unknown) => {
    if(el instanceof HTMLElement) {
        el.style.left = el.offsetLeft + 'px'
        el.style.right = el.offsetTop + 'px'
        el.style.width = getComputedStyle(el).width
        el.style.position  = "absolute"
    }
}
</script>