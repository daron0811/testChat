import Parse from 'parse/node';

export default class Channel extends Parse.Object {
	// type
	// key
	// member

	get key() {
		return this.get('key');
	}

	constructor() {
		super('Channel');
	}

	join(user) {
		const member = this.relation('member');
		member.add(user);
		return this.save();
	}
}
