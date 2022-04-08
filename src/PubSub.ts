import {
	NSSubCallback,
	AnySubCallback,
	NSSubsMap,
	AnySubsSet,
	Middleware,
	MiddlewareSet,
} from './types'

export default class PubSub<DT extends { [K in keyof DT]: DT[K] }> {
	private subs: NSSubsMap<DT> = new Map() // stores a map of namespaces (maps of subscribers)
	private anySubs: AnySubsSet<DT> = new Set() // stores a set of subscribers for any namespace
	private middleware: MiddlewareSet<DT> = new Set() // stores a set of middleware callbacks

	protected runMiddleware = <K extends keyof DT>(namespace: K, data: DT[K]) => {
		let transformedData = data

		this.middleware.forEach(mw => {
			transformedData = mw(namespace, transformedData)
		})

		return transformedData
	}

	protected updateSubscribers = <K extends keyof DT>(namespace: K, data?: DT[K]) => {
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (this.anySubs.size > 0) { // call subscribers for any namespace
			this.anySubs.forEach((callback: AnySubCallback<DT>) => callback(namespace, data))
		}

		if (subsMap && subsMap.size > 0) { // if the map is not empty - call subscribers
			subsMap.forEach((callback: NSSubCallback<K, DT>) => callback(data as DT[K]))
		}
	}

	sub = <K extends keyof DT>(namespace: K, callback: NSSubCallback<K, DT>) => { // subscribe to messages in a namespace
		if (!this.subs.has(namespace)) { // initialize new namespace
			this.subs.set(namespace, new Set())
		}

		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		subsMap!.add(callback as NSSubCallback<keyof DT, DT>) // add subscriber to this namespace

		return () => { // returns an unsubscribe function
			this.unsub(namespace, callback)
		}
	}

	unsub = <K extends keyof DT>(namespace: K, callback: NSSubCallback<K, DT>) => {
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (subsMap) {
			subsMap.delete(callback as NSSubCallback<keyof DT, DT>) // remove subscriber

			if (subsMap.size < 1) { // clear namespace
				this.subs.delete(namespace)
			}
		} else {
			throw new Error(`There are no subscribers in ${namespace}`)
		}
	}

	pub = <K extends keyof DT>(namespace: K, data?: DT[K]) => { // publish data to namespace
		const transformedData = this.runMiddleware(namespace, data as DT[K])

		this.updateSubscribers(namespace, transformedData)
	}

	onAny = (callback: AnySubCallback<DT>) => {
		this.anySubs.add(callback)

		return () => {
			this.offAny(callback)
		}
	}

	offAny = (callback: AnySubCallback<DT>) => {
		this.anySubs.delete(callback)
	}

	hasSubscribers = () => this.subs.size + this.anySubs.size > 0

	hasSubscriber = <K extends keyof DT>(namespace: K, callback: NSSubCallback<K, DT> | null = null) => {
		const nsSubs = this.subs.get(namespace)

		if(!nsSubs) return false
		
		if(callback){
			return nsSubs.has(callback as NSSubCallback<keyof DT, DT>)
		}

		return true
	}

	registerMiddleware = (middleware: Middleware<DT>[] | Middleware<DT>) => {
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

	unregisterMiddleware = (middleware: Middleware<DT>[] | Middleware<DT>) => {
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
