import Parse from 'parse/node';
import Situation from './situation';
import moment from 'moment';
import _ from 'lodash';

export default class Bomb extends Parse.Object {
	// owner
	// channel
	// timestamp
	// state
	// players
	// activate

	get owner() {
		return this.get('owner');
	}
	get channel() {
		return this.get('channel');
	}
	get timestamp() {
		return this.get('timestamp');
	}
	get state() {
		return this.get('state');
	}

	constructor() {
		super('Bomb');
	}

	async isJoined(user) {
		const situations = await Situation.get(this, user);
		return !_.isEmpty(situations);
	}

	getPlayers() {
		const queryPlayers = this.get('players').query();
		{
			queryPlayers.select('displayName');
		}
		return queryPlayers.find();
	}

	getActivate() {
		const queryActivate = this.get('activate').query();
		{
			queryActivate.select('displayName');
		}
		return queryActivate.find();
	}
}
