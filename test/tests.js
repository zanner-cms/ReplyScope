#!/usr/bin/env node

'use strict';


const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const mlog = require('mocha-logger');
const util = require('util');

const Reply = require('zanner-cms-reply').Reply;

const ReplyScope = require('../ReplyScope').ReplyScope;
const AsyncFunction = require('../AsyncFunction').AsyncFunction;


describe('AsyncFunction', () => {

	it('is async function class', () => {
		expect(async function () {}).to.be.instanceof(AsyncFunction);
	});

});

describe('ReplyScope', () => {

	describe('static', () => {

		it('ReplyScope is a function', (done) => {
			expect(ReplyScope).to.be.an.instanceof(Function);
			done();
		});

		it('ReplyScope.init is a function', (done) => {
			expect(ReplyScope.init).to.be.an.instanceof(Function);
			done();
		});

		it('ReplyScope.init creates instanceof Reply', (done) => {
			expect(ReplyScope.init()).to.be.an.instanceof(ReplyScope);
			done();
		});

	});
	
	describe('instance', () => {

		it('ReplyScope creates instanceof ReplyScope with Reply', (done) => {
			let R = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				match: async function () {},
				action: async function () {}
			};

			expect(new ReplyScope({name: R})).to.be.an.instanceof(ReplyScope);
			done();
		});

		it('ReplyScope._setKeyValue', (done) => {
			let name = 'name';
			let service = 'service';
			let dependencies = ['dependency 1', 'dependency 2'];
			let match = async function () {};
			let action = async function () {};
			let R = Reply.init(name, service, dependencies, match, action);
			let r = ReplyScope.init();
			r._setKeyValue('name', R);

			expect(r.keys).to.have.members(['name']);
			done();
		});

		it('ReplyScope._setObject', (done) => {
			let R = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				match: async function () {},
				action: async function () {}
			};
			let r = ReplyScope.init();
			r._setObject({name: R});

			expect(r.keys).to.have.members(['name']);
			done();
		});

		it('ReplyScope.apply exec', (done) => {
			let R = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				match: async function () {},
				action: async function (x, y) { return x + y; }
			};
			let r = ReplyScope.init({name: R});

			expect(r.apply).to.be.an.instanceof(Function);
			expect(r.apply('name', [13, 31])).to.eventually.equal(13 + 31).notify(done);
			//r.apply('name', [13, 31]).should.eventually.equal(44).notify(done);
		});

		it('ReplyScope.apply exec with throw', (done) => {
			let R = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				match: async function () {},
				action: async function (x, y) { throw new Error('ReplyScope.apply'); }
			};
			let r = ReplyScope.init({name: R});

			expect(r.apply('name', [13, 31])).to.be.rejectedWith('ReplyScope.apply').notify(done);
		});

		it('ReplyScope.call exec', (done) => {
			let R = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				match: async function () {},
				action: async function (x, y) { return x + y; }
			};
			let r = ReplyScope.init({name: R});

			expect(r.call).to.be.an.instanceof(Function);
			expect(r.call('name', 13, 31)).to.eventually.equal(13 + 31).notify(done);
			//r.call('name', 13, 31).should.eventually.equal(44).notify(done);
		});

		it('ReplyScope.call exec with throw', (done) => {
			let R = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				match: async function () {},
				action: async function (x, y) { throw new Error('ReplyScope.call'); }
			};
			let r = ReplyScope.init({name: R});

			expect(r.apply('name', 13, 31)).to.be.rejectedWith('ReplyScope.call').notify(done);
		});

	});

});
