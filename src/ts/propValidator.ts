
import { InferDefaults } from "../types/vue-helper"
import type { ToastOptions } from "../types/toast"
import { POSITION, VA_NAMESPACE, TYPE } from "./constant"
import { EventBus } from "./eventBus"
import type { ToastContainerOptions } from "../types/toastContainer"


const emptyFunction = /* istanbul ignore next */ () => {}
const defaultEventBus = /* istanbul ignore next */ () => new EventBus()




const asFactory = <T>(f: T) => (() => f) as unknown as T
export const TOAST_DEFAULT: Required<InferDefaults<Readonly<ToastOptions>>> = {
    id: 0,
    accessibility: () => ({
      toastRole: "alert",
      closeButtonLabel: "close",
    }),
    bodyClassName: () => [],
    closeButton: () => "button",
    closeButtonClassName: () => [],
    closeOnClick: true,
    draggable: true,
    draggablePercent: 0.6,
    eventBus: defaultEventBus,
    hideProgressBar: false,
    icon: () => true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    position: POSITION.TOP_RIGHT,
    rtl: false,
    showCloseButtonOnHover: false,
    timeout: 5000,
    toastClassName: () => [],
    onClick: emptyFunction,
    onClose: emptyFunction,
    type: TYPE.DEFAULT,
}


export const TOAST_CONTAINER_DEFAULTS: InferDefaults<Readonly<ToastContainerOptions>> = {
    position: TOAST_DEFAULT.position, 
    container: () => document.body, 
    containerClassName: () => [],
    eventBus: defaultEventBus, 
    filterBeforeCreate: asFactory((toast => toast)),
    filterToasts: asFactory((toasts => toasts)),
    maxToasts: 20, 
    newestOnTop: true,
    toastDefaults: () => ({}),
    transition: `${VA_NAMESPACE}__bounce`,
    defaultToastProps: /* istanbul ignore next */ () => ({}),
}