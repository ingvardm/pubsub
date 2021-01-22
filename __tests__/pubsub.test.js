const PubSub = require('../src').default

describe('single', () => {
	test('sunscribe', () => {
		const eventA = 'event-a'
		const eventB = 'event-b'
		const eventC = 'event-c'

		const testValueA = 'value-a'
		const testValueB = 'value-b'

		const callbackA = jest.fn()
		const callbackB = jest.fn()
		const callbackC = jest.fn()

		const pubSub = new PubSub()

		const unsubA = pubSub.sub(eventA, callbackA)
		pubSub.on(eventB, callbackB)
		const unsubC = pubSub.sub(eventC, callbackC)

		pubSub.pub(eventA, testValueA)
		pubSub.pub(eventB, testValueB)

		expect(callbackA).toHaveBeenCalledTimes(1)
		expect(callbackB).toHaveBeenCalledTimes(1)
		expect(callbackC).toHaveBeenCalledTimes(0)

		expect(callbackA).toHaveBeenLastCalledWith(testValueA)
		expect(callbackB).toHaveBeenLastCalledWith(testValueB)

		unsubA()
		pubSub.off(eventB, callbackB)
		unsubC()
	})

	test('unsunscribe', () => {
		const eventA = 'event-a'
		const testValueA = 'value-a'
		const pubSub = new PubSub()
		const callbackA = jest.fn()
		const callbackB = jest.fn()

		const unsub = pubSub.sub(eventA, callbackA)
		pubSub.on(eventA, callbackB)

		pubSub.off(eventA, callbackB)
		unsub()

		pubSub.pub(eventA, testValueA)

		expect(callbackA).toHaveBeenCalledTimes(0)
		expect(callbackB).toHaveBeenCalledTimes(0)
	})
})