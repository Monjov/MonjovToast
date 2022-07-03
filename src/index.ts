import type { ToastInterface } from "./ts/interface";
import type { PluginOption } from "./types/plugin";


import "./scss/index.scss"; //sass folder

import { createToastInstance, provideToast, useToast } from "./composable/useToast"

import { POSITION, TYPE } from "./ts/constant";
import { EventBus } from "./ts/eventBus";
import { VueToastPlugin } from "./ts/plugin";

export default VueToastPlugin; 

export {
    createToastInstance, 
    provideToast, 
    useToast, 
    EventBus, 
    POSITION, 
    TYPE, 
    PluginOption, 
    ToastInterface
}