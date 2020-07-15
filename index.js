class PubSub {
	subs = new Map() // stores a map of namespaces (maps of subscribers)
	subId = 0 // used to generate unique id for each subscriber
	releasedSubIds = [] // holds released ids of removed subscribers for reuse

	sub = (namespace, callback) => { // subscribe to messages in a namespace
		if (!this.subs.has(namespace)) { // initialize new namespace
			this.subs.set(namespace, new Map())
		}

		const subId = this.releasedSubIds.shift() || `${this.subId++}` // get first released id or increment id counter
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		subsMap.set(subId, callback) // add subscriber to this namespace

		return () => { // returns an unsubscribe function
			subsMap.delete(subId) // remove subscriber
			this.releasedSubIds.push(subId) // store released id for later use
		}
	}

	pub = (namespace, data) => { // publish to namespace
		const subsMap = this.subs.get(namespace) // map of subscribers for this namespace

		if (subsMap && subsMap.size) { // if the map is not empty - call subscribers
			subsMap.forEach(callback => callback(data))
		}
	}
}

const myPubSub = new PubSub()

const unSub = myPubSub.sub('my-event-name', console.log)

myPubSub.pub('my-event-name', 'This one is printed')

unSub()

myPubSub.pub('my-event-name', 'This one isn\'t')