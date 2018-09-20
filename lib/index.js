import { Client } from '@line/bot-sdk';
import Parse from 'parse/node';
import Bomb from './bomb';
import SpeUser from './user';
import Channel from './channel';
import Situation from './situation';

import schedule from 'node-schedule';
import beautify from 'json-beautify';
import moment from 'moment';
import _ from 'lodash';

const lineConfig = {
	channelAccessToken: process.env.HEROKU_LINE_CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.HEROKU_LINE_CHANNEL_SECRET
};
const client = new Client(lineConfig);

Parse.initialize('AppId', '', 'MasterKey');
Parse.serverURL = 'https://spe3d.herokuapp.com/parse';

Parse.Object.registerSubclass('SpeUser', SpeUser);
Parse.Object.registerSubclass('Channel', Channel);
Parse.Object.registerSubclass('Bomb', Bomb);

class Core {
	get client() {
		return client;
	}

	constructor() {}

	findUser(userId) {
		const queryUser = new Parse.Query(SpeUser);
		{
			queryUser.equalTo('userId', userId);
		}
		return queryUser.first();
	}

	findChannel(key) {
		const queryChannel = new Parse.Query(Channel);
		{
			queryChannel.equalTo('key', key);
		}
		return queryChannel.first();
	}

	findBomb(channel, state) {
		const queryBomb = new Parse.Query(Bomb);
		{
			state && queryBomb.containedIn('state', state);
			queryBomb.equalTo('channel', channel);
			queryBomb.descending('createdAt');
			queryBomb.includeAll();
		}
		return queryBomb.first();
	}

	async registerChannel({ type, roomId, groupId }) {
		if (type === 'user') return;
		const key = roomId || groupId;
		const channel = (await this.findChannel(key)) || new Channel();
		await channel.save({ type, key });
		return channel.fetch();
	}

	async registerUser(profile) {
		const user = (await this.findUser(profile.userId)) || new SpeUser();
		await user.save(profile);
		return user.fetch();
	}

	async setupBomb(channel, owner, timestamp) {
		const queryBomb = new Parse.Query(Bomb);
		{
			queryBomb.equalTo('channel', channel);
			queryBomb.containedIn('state', [ 'INIT', 'STARTED' ]);
			queryBomb.descending('createdAt');
		}

		const bomb = await queryBomb.first();

		bomb && (await bomb.save({ state: 'INVALID' }));

		return new Bomb().save({ channel, owner, timestamp, state: 'INIT' });
	}

	async startBomb(bomb) {
		const date = moment(bomb.timestamp).toDate();
		const handler = _.bind(this.handleBomb, this, bomb);
		const job = schedule.scheduleJob(bomb.id, date, handler);

		await bomb.save({ state: 'STARTED' });
	}

	async endBomb(bomb) {
		await bomb.save({ state: 'ENDED' });
		return await Situation.get(bomb);
	}

	async handleBomb(bomb) {
		const { id, channel } = bomb;
		const { key } = channel;

		schedule.cancelJob(id);

		await this.pushText(key, [ `要爆了～`, `啊～～～` ]);

		const results = await this.endBomb(bomb);
		const situations = _.map(results, (obj) => obj.toJSON());
		const inactivate = _(situations).filter('inactivate').orderBy('inactivate');
		const activate = _(situations).reject('inactivate');

		await this.pushMessage(key, {
			type: 'flex',
			altText: 'This is a Flex Message',
			contents: {
				type: 'bubble',
				styles: {
					footer: { separator: true }
				},
				body: {
					type: 'box',
					layout: 'vertical',
					contents: [
						{
							type: 'text',
							text: '時計報告書',
							weight: 'bold',
							color: '#1DB446',
							size: 'sm'
						},
						{
							type: 'text',
							text: '排行榜',
							weight: 'bold',
							size: 'xxl',
							margin: 'md'
						},
						{
							type: 'box',
							layout: 'vertical',
							margin: 'xxl',
							spacing: 'sm',
							contents: [
								{
									type: 'text',
									text: '成功解除',
									size: 'xs',
									color: '#aaaaaa',
									margin: 'xxl',
									wrap: true
								},
								{
									type: 'separator',
									margin: 'xs'
								},
								...inactivate.map((situation) => ({
									type: 'box',
									layout: 'horizontal',
									contents: [
										{
											type: 'text',
											text: situation.player.displayName,
											size: 'sm',
											color: '#555555',
											flex: 0
										},
										{
											type: 'text',
											text: moment(situation.inactivate).format('HH:mm:ss'),
											size: 'sm',
											color: '#111111',
											align: 'end'
										}
									]
								})),
								{
									type: 'text',
									text: '陣亡',
									size: 'xs',
									color: '#aaaaaa',
									margin: 'xxl',
									wrap: true
								},
								{
									type: 'separator',
									margin: 'xs'
								},
								...activate.map((situation) => ({
									type: 'box',
									layout: 'horizontal',
									contents: [
										{
											type: 'text',
											text: situation.player.displayName,
											size: 'sm',
											color: '#555555',
											flex: 0
										},
										{
											type: 'text',
											text: ' ',
											size: 'sm',
											color: '#111111',
											align: 'end'
										}
									]
								}))
							]
						}
					]
				}
			}
		});
	}

	async inactivateBomb(bomb, user) {
		const activate = bomb.relation('activate');
		activate.remove(user);
		const situations = await Situation.get(bomb, user);
		await situations.pop().save({ inactivate: +moment() });
		return bomb.save();
	}

	async joinPlayer(bomb, user) {
		const situations = await Situation.get(bomb, user);
		const players = bomb.relation('players');
		const activate = bomb.relation('activate');
		players.add(user);
		activate.add(user);
		_.isEmpty(situations) && (await Situation.spawn(bomb, user));
		return bomb.save();
	}

	pushText(to, texts) {
		texts = Array.isArray(texts) ? texts : [ texts ];
		return this.pushMessage(to, texts.map((text) => ({ type: 'text', text })));
	}
	pushMessage(to, message) {
		return client.pushMessage(to, message);
	}

	listJobs() {
		return schedule.scheduledJobs;
	}
}

export default new Core();
