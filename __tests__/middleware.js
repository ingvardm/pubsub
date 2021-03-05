const PubSub = require('../src').default

const mw1 = (_, v) => `${v}a`
const mw2 = (_, v) => `${v}b`
const mw3 = (_, v) => `${v}c`

describe('Middleware tests', () => {
	test('middlleware registration', () => {
		const pubSub = new PubSub()
		const eventName = 'test-event'
		const initialTestVal = 'test-value'
		const callback = jest.fn()

		pubSub.registerMiddleware([mw1, mw2])
		pubSub.onAny(callback)

		pubSub.emit(eventName, initialTestVal)

		const expectedVal1 = mw2(eventName, mw1(eventName, initialTestVal))

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith(eventName, expectedVal1)

		callback.mockReset()

		pubSub.registerMiddleware(mw3)
		pubSub.emit(eventName, expectedVal1)

		const expectedVal2 = mw3(eventName, mw2(eventName, mw1(eventName, expectedVal1)))

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith(eventName, expectedVal2)
	})

	test('middleware removal', () => {
		const pubSub = new PubSub()
		const eventName = 'test-event'
		const initialTestVal = 'test-value'
		const callback = jest.fn()
		const unregisterAll = pubSub.registerMiddleware([mw1, mw2, mw3])

		pubSub.unregisterMiddleware(mw2)
		pubSub.onAny(callback)

		pubSub.emit(eventName, initialTestVal)

		const expectedVal1 = mw3(eventName, mw1(eventName, initialTestVal))

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith(eventName, expectedVal1)

		callback.mockReset()
		unregisterAll()

		pubSub.emit(eventName, initialTestVal)

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith(eventName, initialTestVal)
	})
})