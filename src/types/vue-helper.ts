


type NotUndefined<T> = T extends undefined ? never : T 

type InferDefault<T> = T extends 
                | null 
                | number 
                | string 
                | boolean
                | Function 
                | symbol 
                ? T : () => T


export type InferDefaults<T> = {
    [K in keyof T]?: InferDefault<NotUndefined<T[K]>>
  }