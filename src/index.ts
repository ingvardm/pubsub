export type SubCallback = (data: any) => void

type SubId = string
type NamespaceSubs = Map<SubId, SubCallback>
type SubsMap = Map<string, NamespaceSubs>
type NamespaceLookup = WeakMap<SubCallback, SubId>
type SubsLookup = Map<string, NamespaceLookup>

export default class PubSub {
	private subs: SubsMap = new Map() // stores a map of namespaces (maps of subscribers)
	private subId = 0 // used to generate unique id for each subscriber
	private releasedSubIds: string[] = [] // holds released ids of removed subscribers for reuse
	private lookup: SubsLookup = new Map()

	private removeSubscription = (subsMap: NamespaceSubs, subId: SubId, idTable: NamespaceLookup, callback: SubCallback) => {
		subsMap!.delete(subId) // remove subscriber
		idTable!.delete(callback)
		this.releasedSubIds.push(subId) // store released id for later use
	}

	sub = (namespace: string, callback: SubCallback) => { // subscribe to messages in a namespace
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

	unsub = (namespace: string, callback: SubCallback) => {
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

	pub = (namespace: string, data: any) => { // publish data to namespace
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (subsMap && subsMap.size) { // if the map is not empty - call subscribers
			subsMap.forEach((callback: SubCallback) => callback(data))
		}
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
