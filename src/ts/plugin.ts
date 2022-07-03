

import { Plugin } from "vue";
import { createToastInstance, toastInjectionKey } from "../composable/useToast";
import type { PluginOption } from "../types/plugin";
import { globalEventBus } from "./eventBus"


export const VueToastPlugin: Plugin = (App, options?: PluginOption) => {
    if(options?.shareAppContext === true) {
        options.shareAppContext = App
    }


    const inter = createToastInstance({
        eventBus: globalEventBus, 
        ...options
    })


    App.provide(toastInjectionKey, inter)
}