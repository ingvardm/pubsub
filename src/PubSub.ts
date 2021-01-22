import {
	NS,
	NSSubCallback,
	AnySubCallback,
	NSSubsMap,
	AnySubsSet,
} from './types'

export default class PubSub {
	private subs: NSSubsMap = new Map() // stores a map of namespaces (maps of subscribers)
	private anySubs: AnySubsSet = new Set() // stores a set of subscribers for any namespace

	sub = (namespace: NS, callback: NSSubCallback) => { // subscribe to messages in a namespace
		if (!this.subs.has(namespace)) { // initialize new namespace
			this.subs.set(namespace, new Set())
		}

		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		subsMap!.add(callback) // add subscriber to this namespace

		return () => { // returns an unsubscribe function
			this.unsub(namespace, callback)
		}
	}

	unsub = (namespace: NS, callback: NSSubCallback) => {
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (subsMap) {
			subsMap.delete(callback) // remove subscriber
		} else {
			throw new Error(`There are no subscribers in ${namespace}`)
		}
	}

	pub = (namespace: NS, data: any) => { // publish data to namespace
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (this.anySubs.size > 0) { // call subscribers for any namespace
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
