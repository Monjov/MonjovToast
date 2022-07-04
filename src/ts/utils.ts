
import { Component, defineComponent, toRaw, unref } from "vue"
import type { RenderableToastContent, ToastComponent, ToastContent } from "../types/toast"
import type { ToastContainerOptions } from "../types/toastContainer"; 
import { BasePluginOptions } from "../types/plugin"; 

interface DictionaryLike {
    [index: string]: unknown
}


export const isUndefined = (value: unknown): value is undefined => typeof value === "undefined"

export const isFunction = (value: unknown): value is Function => typeof value === "function"
export const isString = (value: unknown): value is string => typeof value === "string"
export const isNonEmptyString = (value: unknown): value is string =>
        isString(value) && value.trim().length > 0

const isNumber = (value: unknown): value is number => typeof value === "number"
const isObject = (value: unknown): value is DictionaryLike => 
    typeof value === "object" && value !== null

const isJSX = (obj: unknown): obj is JSX.Element => hasProp(obj, "tag") && isNonEmptyString(obj.tag)


const isTouchEvent = (event: Event): event is TouchEvent =>
    window.TouchEvent && event instanceof TouchEvent



export const isToastComponent = (obj: unknown): obj is ToastComponent =>
    hasProp(obj, 'component') && isToastContent(obj.component)


const isVueComponent = (c: unknown): c is Component => isFunction(c) || isObject(c)

export const isToastContent = (obj: unknown): obj is ToastContent =>
    // Ignore undefined
    !isUndefined(obj) &&
    // Is a string
    (isString(obj) ||
      // Regular Vue component
      isVueComponent(obj) ||
      // Nested object
      isToastComponent(obj))
  


export const isDOMRect = (obj: unknown): obj is DOMRect => 
    isObject(obj) && ["height", "width", "right", "left", "top", "bottom"].every(p => isNumber(obj[p]))



export const hasProp = <O, K extends PropertyKey>(obj: O, propKey: K): obj is O & { [key in K]: unknown} => 
        (isObject(obj) || isFunction(obj)) && propKey in obj


export const getProp = <O, K extends PropertyKey, D>(
    obj: O, 
    propKey: K, 
    fallback: D
): K extends keyof O ? O[K] : D => 
    (hasProp(obj, propKey) ? obj[propKey] : fallback) as K extends keyof O ? O[K] : D





//generate ID for toast

export const getId = (i => () => i++)(0)


export function getX(event: MouseEvent | TouchEvent) {
    return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX
}



export function getY(event: MouseEvent | TouchEvent) {
    return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientY
}



export const removeElement = (el: Element) => {
    if(!isUndefined(el.remove)) {
        el.remove()
    
    }else if(el.parentNode){
        el.parentNode.removeChild(el)
    }
}



export const getVueComponentFromObj = (obj: ToastContent): RenderableToastContent => {
    if (isToastComponent(obj)) {
        // Recurse if component prop
        return getVueComponentFromObj(obj.component)
      }
      if (isJSX(obj)) {
        // Create render function for JSX
        return defineComponent({
          render() {
            return obj
          },
        })
      }
      // Return regular string or raw object
      return typeof obj === "string" ? obj : toRaw(unref(obj))
}


export const normalizeToastComponent = (obj: ToastContent): ToastContent => {
    if(typeof obj === "string" ){
        return obj
    }


const props = hasProp(obj, "props") && isObject(obj.props) ? obj.props : {}


const listeners = (hasProp(obj, "listeners") && isObject(obj.listeners) ? obj.listeners : {}
    ) as ToastComponent["listeners"]


    return { component: getVueComponentFromObj(obj), props, listeners}
} 



export const isBrowser = () => typeof window !== "undefined"; 
export const asContainerProps = (options: BasePluginOptions): ToastContainerOptions => {
    const {
        position,
        container,
        newestOnTop,
        maxToasts,
        transition,
        toastDefaults,
        eventBus,
        filterBeforeCreate,
        filterToasts,
        containerClassName,
        ...defaultToastProps
      } = options
      
      const containerProps = {
        position,
        container,
        newestOnTop,
        maxToasts,
        transition,
        toastDefaults,
        eventBus,
        filterBeforeCreate,
        filterToasts,
        containerClassName,
        defaultToastProps,
    }


    const keys = Object.keys(containerProps) as (keyof ToastContainerOptions)[]

    keys.forEach(key => typeof containerProps[key] === "undefined" && delete containerProps[key])


    return containerProps
}


