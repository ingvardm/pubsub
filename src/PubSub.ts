import {
	SubId,
	NS,
	NSSubCallback,
	AnySubCallback,
	NSSubs,
	NSSubsMap,
	NSLookup,
	SubsLookup,
	AnySubsSet,
} from './types'

export default class PubSub {
	private subs: NSSubsMap = new Map() // stores a map of namespaces (maps of subscribers)
	private subId = 0 // used to generate unique id for each subscriber
	private releasedSubIds: SubId[] = [] // holds released ids of removed subscribers for reuse
	private lookup: SubsLookup = new Map()
	private anySubs: AnySubsSet = new Set()

	private removeSubscription = (subsMap: NSSubs, subId: SubId, idTable: NSLookup, callback: NSSubCallback) => {
		subsMap!.delete(subId) // remove subscriber
		idTable!.delete(callback)
		this.releasedSubIds.push(subId) // store released id for later use
	}

	sub = (namespace: NS, callback: NSSubCallback) => { // subscribe to messages in a namespace
		if (!this.subs.has(namespace)) { // initialize new namespace
			this.subs.set(namespace, new Map())
		}

		if (!this.lookup.has(namespace)) {
			this.lookup.set(namespace, new WeakMap())
		}

		const subId = this.releasedSubIds.shift() || `${this.subId++}` // get first released id or increment id counter
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace
		const idTable = this.lookup.get(namespace)

		subsMap!.set(subId, callback) // add subscriber to this namespace
		idTable!.set(callback, subId)

		return () => { // returns an unsubscribe function
			this.removeSubscription(subsMap!, subId, idTable!, callback)
		}
	}

	unsub = (namespace: NS, callback: NSSubCallback) => {
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace
		if (Boolean(subsMap)) {
			const idTable = this.lookup.get(namespace)
			const subId = idTable!.get(callback)

			if (subId) {
				this.removeSubscription(subsMap!, subId, idTable!, callback)
			} else {
				throw `The provided callback is not subscribed to ${namespace}`
			}
		} else {
			throw `There are no subscribers in ${namespace}`
		}
	}

	pub = (namespace: NS, data: any) => { // publish data to namespace
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (this.anySubs.size > 0) {
			this.anySubs.forEach((callback: AnySubCallback) => callback(namespace, data))
		}

		if (subsMap && subsMap.size > 0) { // if the map is not empty - call subscribers
			subsMap.forEach((callback: NSSubCallback) => callback(data))
		}
	}

	onAny = (callback: AnySubCallback) => {
		this.anySubs.add(callback)

		return () => {
			this.offAny(callback)
		}
	}

	offAny = (callback: AnySubCallback) => {
		this.anySubs.delete(callback)
	}

	// subscribe aliases
	subscribe = this.sub
	listen = this.sub
	on = this.sub

	// publish aliases
	publish = this.pub
	emit = this.pub

	// unsubscribe aliases
	off = this.unsub
}
