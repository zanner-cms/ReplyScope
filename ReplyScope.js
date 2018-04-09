#!/usr/bin/env node

'use strict';


const Reply = require('zanner-cms-reply').Reply;
const Scope = require('zanner-cms-scope').Scope;

const AsyncFunction = require('./AsyncFunction').AsyncFunction;


class ReplyScope extends Scope {

	static init (...args) {
		return Object.freeze(new ReplyScope(...args));
	}

	_setKeyValue (key, value) {
		if (value instanceof Reply) return super._setKeyValue(key, value);
		throw new Error('ReplyScope._setKeyValue got value not an Reply');
	}

	_setObject (object) {
		if (object instanceof Reply) return super._setKeyValue(object.name, object);
		if (object instanceof Object) {
			let result = Object.keys(object).map(key => {
				let O = object[key] || {};
				let name = O.name;
				let service = O.service;
				let dependencies = O.dependencies;
				let match = O.match;
				let action = O.action;
				this._setKeyValue(key, Reply.init(name, service, dependencies, match, action));
			}, this);
			return result.length===1 ? result[0] : result;
		}
		throw new Error('ReplyScope._setObject called with non-object');
	}

	apply (key, args) {		
		if (this._is(key)) return this._get(key).apply(args);
		throw new Error('ReplyScope.apply called with key not in Scope');
	}

	call (key, ...args) {
		if (this._is(key)) return this._get(key).call(...args);
		throw new Error('ReplyScope.call called with key not in Scope');
	}

}

exports.ReplyScope = ReplyScope;
