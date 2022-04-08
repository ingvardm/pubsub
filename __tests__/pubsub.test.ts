import PubSub from '../src'

type Events = {
	'event-a': string
	'event-b': number
	'event-c': undefined
}

describe('single', () => {
	test('sunscribe', () => {
		const testValueA = 'value-a'
		const testValueB = 1

		const callbackA = jest.fn()
		const callbackB = jest.fn()
		const callbackC = jest.fn()

		const pubSub = new PubSub<Events>()

		const unsubA = pubSub.sub('event-a', callbackA)
		pubSub.on('event-b', callbackB)
		const unsubC = pubSub.sub('event-c', callbackC)

		pubSub.pub('event-a', testValueA)
		pubSub.pub('event-b', testValueB)

		expect(callbackA).toHaveBeenCalledTimes(1)
		expect(callbackB).toHaveBeenCalledTimes(1)
		expect(callbackC).toHaveBeenCalledTimes(0)

		expect(callbackA).toHaveBeenLastCalledWith(testValueA)
		expect(callbackB).toHaveBeenLastCalledWith(testValueB)

		unsubA()
		pubSub.off('event-b', callbackB)

		expect(pubSub.hasSubscribers()).toEqual(true)

		unsubC()

		expect(pubSub.hasSubscribers()).toEqual(false)
	})

	test('unsunscribe', () => {
		const pubSub = new PubSub<Events>()
		const callbackA = jest.fn()
		const callbackB = jest.fn()

		const unsub = pubSub.sub('event-a', callbackA)
		pubSub.on('event-a', callbackB)

		pubSub.off('event-a', callbackB)
		unsub()

		pubSub.pub('event-a', '')

		expect(callbackA).toHaveBeenCalledTimes(0)
		expect(callbackB).toHaveBeenCalledTimes(0)
	})

	test('any ns subsccription', () => {
		const testValueA = 'value-a'
		const pubSub = new PubSub<Events>()
		const callbackA = jest.fn()

		const unsub = pubSub.onAny(callbackA)

		pubSub.pub('event-a', testValueA)

		expect(callbackA).toHaveBeenCalledTimes(1)
		expect(callbackA).toHaveBeenCalledWith('event-a', testValueA)

		callbackA.mockClear()

		expect(pubSub.hasSubscribers()).toEqual(true)

		unsub()

		expect(pubSub.hasSubscribers()).toEqual(false)

		pubSub.pub('event-a', testValueA)

		expect(callbackA).toHaveBeenCalledTimes(0)
	})
})
