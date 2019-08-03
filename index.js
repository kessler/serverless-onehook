const path = require('path')
const { isString, isNullOrUndefined } = require('util')

class OneHook {
	constructor(serverless, options) {
		this.serverless = serverless
		this.options = options
		this.commands = {}
		this.hooks = {}

		this._userHooks = new Map()

		let hookPath = 'oneHook.js'
		if (serverless.service.custom && isString(serverless.service.custom.hookPath)) {
			hookPath = serverless.service.custom.hookPath
		}
		hookPath = path.resolve(serverless.config.servicePath, hookPath)
		const oneHook = require(hookPath)
		oneHook(this)

		this._existingHookNames = Object.keys(serverless.pluginManager.hooks)

		this._wrapHooks(serverless.pluginManager.hooks)
	}

	before(hookName, fn) {
		this._hook(hookName, 'before', fn)
	}

	after(hookName, fn) {
		this._hook(hookName, 'after', fn)
	}

	get existingHookNames() {
		return this._existingHookNames
	}

	_wrapHooks(slsHooks) {
		for (let key in slsHooks) {
			const userHook = this._userHooks.get(key)
			if (!userHook) continue

			const { before, after } = userHook

			let eventHooks = slsHooks[key]

			if (isNullOrUndefined(eventHooks)) {
				eventHooks = slsHooks[key] = []
			}

			if (before) {
				eventHooks.unshift({ pluginName: 'OneHook', hook: before })
			}

			if (after) {
				eventHooks.push({ pluginName: 'OneHook', hook: after })
			}
		}
	}

	_hook(hookName, phase, fn) {
		let entry = this._userHooks.get(hookName)
		if (!entry) {
			entry = {}
			this._userHooks.set(hookName, entry)
		}
		entry[phase] = fn
	}
}

module.exports = OneHook