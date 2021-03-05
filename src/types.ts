export type NS = string
export type NSSubCallback = (data: any) => void
export type AnySubCallback = (namespace: NS, data: any) => void
export type NSSubs = Set<NSSubCallback>
export type NSSubsMap = Map<NS, NSSubs>
export type AnySubsSet = Set<AnySubCallback>
export type Middleware = (namespace: NS, data: any) => any
export type MiddlewareSet = Set<Middleware>