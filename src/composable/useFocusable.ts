import { toRefs, Ref, onBeforeUnmount, onMounted, ref } from "vue"; 

import { Focusable } from "../types/common";



export const useFocusable = (el: Ref<HTMLElement | undefined>, props: Required<Focusable>) => {
    const  { pauseOnFocusLoss } = toRefs(props)
    const focused = ref(false); 
    const onFocus = () => (focused.value = true); 
    const onBlur = () => (focused.value = false); 



    onMounted(() => {
        if(el.value && pauseOnFocusLoss.value) {
            addEventListener("blur", onBlur)
            addEventListener("focus", onFocus)
        }
    })


    onBeforeUnmount(() => {
        if(el.value && pauseOnFocusLoss.value) {
            removeEventListener("blur", onBlur)
            removeEventListener("focus", onFocus)
        }
    })


    return { focused }
}