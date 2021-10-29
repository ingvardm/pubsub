export type NSSubCallback<T = any> = (data: T) => void
export type AnySubCallback<NS = string, T = any> = (namespace: NS, data: T) => void
export type NSSubs<T> = Set<NSSubCallback<T>>
export type NSSubsMap<NS = string, T = any> = Map<NS, NSSubs<T>>
export type AnySubsSet<NS = string, T = any> = Set<AnySubCallback<NS, T>>
export type Middleware<NS = string, T= any> = (namespace: NS, data?: T) => T
export type MiddlewareSet<NS = string, T = any> = Set<Middleware<NS, T>>
