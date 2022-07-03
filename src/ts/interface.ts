import { Component, nextTick, createApp } from "vue"
import VaToastContainer from "../components/VaToastContainer.vue"
import type { ToastContent, ToastOptions, ToastOptionsAndContent } from "../types/toast"
import { EventBus, EventBusInterface } from "./eventBus"
import type { BasePluginOptions, PluginOption } from "../types/plugin"
import { asContainerProps, getId, isUndefined } from "./utils"
import { EVENTS, TYPE } from "./constant"


export declare type ToastID = string | number 
export declare type ClassName = string | string[]




export declare interface EventBusable {
    eventBus?: EventBusInterface 
}




export declare interface Draggable {
      /**
   *  Position of the toast on the screen.
   *
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */
    draggable?: boolean

    /**
    *      By how much of the toast width in percent (0 to 1) it must be dragged before being dismissed.
   */
     draggablePercent?: number
}


export declare interface Hoverable {
    /**
     *  Whether or not the toast is paused when it is hovered by the mouse.
     */
    pauseOnHover?: boolean
}


interface ToastMethod<T extends TYPE = TYPE> {
    (content: ToastContent, options?: ToastOptions & { type?: T }): ToastID
}


interface DismissToast {
    (toastID: ToastID): void
}



interface ClearToasts {
    (): void
}


interface UpdateDefaults {
    /**
     * @param update Plugin options to update
     *
     * Accepts all* options provided during plugin
     * registration and updates them.
     *
     */
    (update: BasePluginOptions): void
}



interface UpdateToast {
    /**
     * @param toastID ID of the toast to update
     * @param update Object that may contain the content to update, or the options to merge
     * @param create If set to false, this method only updates existing toasts and does
     * nothing if the provided `toastID` does not exist
     */
    (
      toastID: ToastID,
      update: { content?: ToastContent; options?: ToastOptions },
      create?: false
    ): void
    /**
     * @param toastID ID of the toast to create / update
     * @param update Object that must contain the toast content and may contain the options to merge
     * @param create If set to true, this method updates existing toasts or creates new toasts if
     * the provided `toastID` does not exist
     */
    (
      toastID: ToastID,
      update: { content: ToastContent; options?: ToastOptions },
      create: true
    ): void
}


export interface ToastInterface extends ToastMethod{
      /**
   * Display a success toast
   */
  success: ToastMethod<TYPE.SUCCESS>
  /**
   * Display an info toast
   */
  info: ToastMethod<TYPE.INFO>
  /**
   * Display a warning toast
   */
  warning: ToastMethod<TYPE.WARNING>
  /**
   * Display an error toast
   */
  error: ToastMethod<TYPE.ERROR>
  /**
   * Dismiss toast specified by an id
   */
  dismiss: DismissToast
  /**
   * Update Toast
   */
  update: UpdateToast
  /**
   * Clear all toasts
   */
  clear: ClearToasts
  /**
   * Update Plugin Defaults
   */
  updateDefaults: UpdateDefaults
}


export declare type Icon = | boolean | string | {
    iconTag?: keyof HTMLElementTagNameMap 
    iconChildren?: string 
    iconClass?: string
} |  Component | JSX.Element



export declare type Button = | false | keyof HTMLElementTagNameMap | Component |JSX.Element
export declare interface Focusable {
    /**
     *  Whether or not the toast is paused when the window loses focus.
     */
    pauseOnFocusLoss?: boolean
}


function mountPlugin(option: PluginOption) {
    const { shareAppContext, onMounted, ...basePluginOptions } = option
    const containerProps = asContainerProps(basePluginOptions)

    const app = createApp(VaToastContainer, {
        ...containerProps,
    })

    if (shareAppContext && shareAppContext !== true) {
        const userApp = shareAppContext
        app._context.components = userApp._context.components
        app._context.directives = userApp._context.directives
        app._context.mixins = userApp._context.mixins
        app._context.provides = userApp._context.provides
        app.config.globalProperties = userApp.config.globalProperties
    }

    const component = app.mount(document.createElement("div"))

    if (!isUndefined(onMounted)) {
      onMounted(component, app)
    }

}


const createInterface = (events: EventBusInterface): ToastInterface => {
    const createToastMethod = <T extends TYPE = TYPE>(type: T): ToastMethod<T> => {
      const method: ToastMethod<T> = (content, options) => {
        const props: ToastOptionsAndContent & {
          id: ToastID
        } = Object.assign({ id: getId(), type, content }, options)
        
        events.emit(EVENTS.ADD, props)
        return props.id
      }


      return method
    }
  
    const dismiss: DismissToast = toastID => events.emit(EVENTS.DISMISS, toastID)
    const clear: ClearToasts = () => events.emit(EVENTS.CLEAR, undefined)
    const updateDefaults: UpdateDefaults = update =>
      events.emit(EVENTS.UPDATE_DEFAULTS, asContainerProps(update))
    const update: UpdateToast = (toastID, update, create) => {
    const { content, options } = update
    events.emit(EVENTS.UPDATE, {
        id: toastID,
        create: create || false,
        options: { ...options, content: content as ToastContent },
      })
    }
  
    return Object.assign(createToastMethod<TYPE>(TYPE.DEFAULT), {
      success: createToastMethod(TYPE.SUCCESS),
      info: createToastMethod(TYPE.INFO),
      warning: createToastMethod(TYPE.WARNING),
      error: createToastMethod(TYPE.ERROR),
      dismiss,
      clear,
      update,
      updateDefaults,
    })
  }

export const buildInterface = (globalOptions: PluginOption = {},  mountContainer = true): ToastInterface => {
    const options = { ...globalOptions }
    const events = (options.eventBus = options.eventBus || new EventBus())

    if(mountContainer){
        nextTick(() => mountPlugin(options))
    }


    return createInterface(events)
}