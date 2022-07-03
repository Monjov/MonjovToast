import { getCurrentInstance, inject, InjectionKey, provide } from "vue";
import { VA_NAMESPACE } from "../ts/constant";
import { EventBus, EventBusInterface, globalEventBus, isEventBusInterface } from "../ts/eventBus";
import { buildInterface, ToastInterface } from "../ts/interface";
import { isBrowser } from "../ts/utils";
import { PluginOption } from "../types/plugin";
import { ToastOptions } from "../types/toast";


import { createToastInstance as ownExports_createToastInstance } from "./useToast"
export const toastInjectionKey: InjectionKey<ToastInterface> = Symbol("VueToast")



interface CreateToastInstance {
    (eventBus: EventBusInterface): ToastInterface
    
    (options?: PluginOption): ToastInterface

}



const createMockToastInstance: CreateToastInstance = () => {
    const toast = () => {
        console.warn(`[${VA_NAMESPACE}] This plugin does not support SSR!`)
    }


    return new Proxy(toast, {
        get() {
            return toast
        }, 
    }) as unknown as ToastInterface
}


export const createToastInstance: CreateToastInstance = optionOrEventBus => {
    if(!isBrowser()) {
        return createMockToastInstance()
    }


    if(isEventBusInterface(optionOrEventBus)) {
        return buildInterface({ eventBus: optionOrEventBus }, false)
    }

    return buildInterface(optionOrEventBus, true)
}



export const provideToast = (options?: PluginOption) => {
    if (getCurrentInstance()) {
      const toast = ownExports_createToastInstance(options)
      provide(toastInjectionKey, toast)
    }
  } 


export const useToast = (eventBus?: EventBus) => {
    if(eventBus) {
        return ownExports_createToastInstance(eventBus)
    } 


    const toast = getCurrentInstance() ? inject(toastInjectionKey, undefined) : undefined

    return toast ? toast : ownExports_createToastInstance(globalEventBus)
}