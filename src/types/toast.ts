
import type { Component } from "vue";

import type { TYPE, POSITION } from "../ts/constant";
import { ClassName } from "../ts/interface";
import { 
    Button, 
    ClassNames, 
    Draggable, 
    EventBusable, 
    Focusable, 
    Hoverable, 
    Icon, 
    ToastID 
} from "./common";


export declare type RenderableToastContent = string | Component


export declare interface BaseToastOptions extends EventBusable, Draggable, Hoverable, Focusable{
    position?: POSITION
    
    closeOnClick?: boolean 

    timeout?: number | false 

    toastClassName?: ClassNames


    bodyClassName?:ClassName


    hideProgressBar?: boolean 

    showCloseButtonOnHover?: boolean

    icon?: Icon


    closeButton?: Button


    closeButtonClassName?: ClassNames


    accessibility?: {
        toastRole?: string

        closeButtonLabel?: string
    }

    rtl?: boolean
}


export declare interface ToastOptions extends BaseToastOptions {
    id?: ToastID

    type?: TYPE

    onClick?: (closeToast: Function) => void

    onClose?: () => void
}


export declare interface ToastComponent {
    component: ToastContent

    props?: { [propName: string ]: unknown }

    listeners?: { [listenerEvent: string ]: Function }
}



export declare type ToastContent = | RenderableToastContent | JSX.Element | ToastComponent


export declare type ToastOptionsAndContent = ToastOptions & {
    content: ToastContent
}