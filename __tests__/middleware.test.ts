import PubSub from '../src'

type Events = {
	'test-event': string
}

const mw1 = (_: keyof Events, v: string) => `${v}a`
const mw2 = (_: keyof Events, v: string) => `${v}b`
const mw3 = (_: keyof Events, v: string) => `${v}c`

describe('Middleware tests', () => {
	test('middlleware registration', () => {
		const pubSub = new PubSub<Events>()
		const initialTestVal = 'test-value'
		const callback = jest.fn()

		pubSub.registerMiddleware([mw1, mw2])
		pubSub.onAny(callback)

		pubSub.emit('test-event', initialTestVal)

		const expectedVal1 = mw2('test-event', mw1('test-event', initialTestVal))

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith('test-event', expectedVal1)

		callback.mockReset()

		pubSub.registerMiddleware(mw3)
		pubSub.emit('test-event', expectedVal1)

		const expectedVal2 = mw3('test-event', mw2('test-event', mw1('test-event', expectedVal1)))

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith('test-event', expectedVal2)
	})

	test('middleware removal', () => {
		const pubSub = new PubSub<Events>()
		const initialTestVal = 'test-value'
		const callback = jest.fn()
		const unregisterAll = pubSub.registerMiddleware([mw1, mw2, mw3])

		pubSub.unregisterMiddleware(mw2)
		pubSub.onAny(callback)

		pubSub.emit('test-event', initialTestVal)

		const expectedVal1 = mw3('test-event', mw1('test-event', initialTestVal))

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith('test-event', expectedVal1)

		callback.mockReset()
		unregisterAll()

		pubSub.emit('test-event', initialTestVal)

		expect(callback).toBeCalledTimes(1)
		expect(callback).toHaveBeenLastCalledWith('test-event', initialTestVal)
	})
})
