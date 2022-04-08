export type NSSubCallback<K extends keyof DT, DT> = (data: DT[K]) => void
export type AnySubCallback<DT> = <K extends keyof DT>(namespace: K, data?: DT[K]) => void
export type NSSubs<DT> = Set<NSSubCallback<keyof DT, DT>>
export type NSSubsMap<DT> = Map<keyof DT, NSSubs<DT>>
export type AnySubsSet<DT> = Set<AnySubCallback<DT>>
export type Middleware<DT> = <K extends keyof DT>(namespace: K, data: DT[K]) => DT[K]
export type MiddlewareSet<DT> = Set<Middleware<DT>>
