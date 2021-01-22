export type SubId = string
export type NS = string
export type NSSubCallback = (data: any) => void
export type AnySubCallback = (namespace: NS, data: any) => void
export type NSSubs = Map<SubId, NSSubCallback>
export type NSSubsMap = Map<NS, NSSubs>
export type NSLookup = WeakMap<NSSubCallback, SubId>
export type SubsLookup = Map<NS, NSLookup>
export type AnySubsSet = Set<AnySubCallback>