import {
	NS,
	NSSubCallback,
	AnySubCallback,
	NSSubsMap,
	AnySubsSet,
	Middleware,
	MiddlewareSet,
} from './types'

export default class PubSub {
	private subs: NSSubsMap = new Map() // stores a map of namespaces (maps of subscribers)
	private anySubs: AnySubsSet = new Set() // stores a set of subscribers for any namespace
	private middleware: MiddlewareSet = new Set() // stores a set of middleware callbacks

	protected runMiddleware = (namespace: NS, data: any) => {
		let transformedData = data;

		this.middleware.forEach(mw => {
			transformedData = mw(namespace, transformedData)
		})

		return transformedData
	}

	protected updateSubscribers = (namespace: NS, data: any) => {
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (this.anySubs.size > 0) { // call subscribers for any namespace
			this.anySubs.forEach((callback: AnySubCallback) => callback(namespace, data))
		}

		if (subsMap && subsMap.size > 0) { // if the map is not empty - call subscribers
			subsMap.forEach((callback: NSSubCallback) => callback(data))
		}
	}

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

			if (subsMap.size < 1) { // clear namespace
				this.subs.delete(namespace)
			}
		} else {
			throw new Error(`There are no subscribers in ${namespace}`)
		}
	}

	pub = (namespace: NS, data?: any) => { // publish data to namespace
		const transformedData = this.runMiddleware(namespace, data)

		this.updateSubscribers(namespace, transformedData)
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

	hasSubscribers = () => this.subs.size > 0

	registerMiddleware = (middleware: Middleware | Middleware[]) => {
		if (Array.isArray(middleware)) {
			middleware.forEach(mw => {
				this.middleware.add(mw)
			})
		} else {
			this.middleware.add(middleware)
		}

		return () => {
			this.unregisterMiddleware(middleware)
		}
	}

	unregisterMiddleware = (middleware: Middleware | Middleware[]) => {
		if (Array.isArray(middleware)) {
			middleware.forEach(mw => {
				this.middleware.delete(mw)
			})
		} else {
			this.middleware.delete(middleware)
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
	unsubscribe = this.unsub
	off = this.unsub
}
