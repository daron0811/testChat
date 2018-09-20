import Core from './';
import beautify from 'json-beautify';
import moment from 'moment';
import _ from 'lodash';

export default [
	{
		type: '小雷',
		onCommand: async (context) => {
			const { channel } = context;
			const columns = [];
			const bomb = await Core.findBomb(channel, [ 'INIT', 'STARTED' ]);
			if (bomb) {
				const { owner, state, timestamp } = bomb.toJSON();
				const ownerName = owner.displayName;
				const actions = [ { label: '下注', type: 'uri', uri: 'https://line.me' } ];
				state === 'INIT' && actions.push({ label: '啟動炸彈', type: 'message', text: '小雷啟動炸彈' });
				state === 'STARTED' && actions.push({ label: '我要參加', type: 'message', text: '小雷我要參加' });
				const text = `發起人：${ownerName}\n引爆時間：${moment(timestamp).format('YYYY-MM-DD HH:mm')}`;
				columns.push({
					thumbnailImageUrl:
						'https://scontent.ftpe8-4.fna.fbcdn.net/v/t1.0-9/41662428_2094855860830973_8167305729854668800_n.jpg?_nc_cat=100&oh=8a57b9df785fd0162992fcf356da6afd&oe=5C27E3B9',
					imageAspectRatio: 'rectangle',
					imageSize: 'cover',
					imageBackgroundColor: '#FFFFFF',
					title: '炸彈狀態',
					text,
					actions
				});
			}
			columns.push({
				title: '工具包',
				text: '各種操作',
				thumbnailImageUrl: 'https://wiki.komica.org/images/thumb/b/b2/Img1858.jpg/450px-Img1858.jpg',
				imageAspectRatio: 'rectangle',
				imageSize: 'cover',
				imageBackgroundColor: '#FFFFFF',
				actions: [
					{ label: '裝炸彈', type: 'datetimepicker', data: 'DATETIME', mode: 'datetime' },
					{ label: '拆炸彈', type: 'postback', data: 'action=removeBomb', text: '解除炸彈' }
				]
			});

			context.replyMessage({
				type: 'template',
				altText: '小雷Menu',
				template: { type: 'carousel', columns }
			});
		}
	},
	{
		type: '小雷吃大便',
		onCommand: async (context) => {
			const { user, channel } = context;
			context.replyText(`${beautify(user.toJSON(), null, 2, 25)}`);
			context.replyText(`${beautify(channel.toJSON(), null, 2, 25)}`);
		}
	},
	{
		type: '小雷裝炸彈',
		onCommand: async (context) => {
			const { channel, user, message } = context;
			const cmds = _.split(message.text, ' ');

			console.log(cmds);

			if (cmds.length < 3) {
				return context.replyText('請輸入：小雷裝炸彈 日期 時間\n小雷裝炸彈 2018-10-04 10:30');
			}

			const timestamp = +moment(_.drop(cmds).join('T'));

			await Core.setupBomb(channel, user, timestamp);

			context.replyMessage({
				type: 'template',
				altText: '炸彈來囉(ง๑ •̀_•́)ง',
				template: {
					type: 'buttons',
					title: '炸彈來囉(ง๑ •̀_•́)ง',
					text: `${cmds[1]} ${cmds[2]} 隨機告⽩白`,
					actions: [
						{ type: 'uri', label: '修改炸彈規則', uri: 'line://app/1605575807-LJnm1B6k' },
						{ type: 'message', label: '啟動炸彈', text: '小雷啟動炸彈' }
					]
				}
			});
			context.replyText('God bless you.');
		}
	},
	{
		type: '小雷啟動炸彈',
		onCommand: async (context) => {
			const { channel, user } = context;
			const bomb = await Core.findBomb(channel);

			if (bomb.state === 'STARTED') {
				return context.replyText([ 'Rex：白癡喔！！', `炸彈已經啟動～ 趕快參加吧！！` ]);
			}
			if (!user.equals(bomb.owner)) {
				const { displayName } = bomb.owner;
				return context.replyText([ 'Rex：三小啦', `你又不是${displayName} 啟動個屁啊！！` ]);
			}

			await Core.startBomb(bomb);

			context.replyMessage({
				type: 'template',
				altText: `炸彈定時囉ξ( ✿＞◡❛)`,
				template: {
					type: 'buttons',
					title: '炸彈定時囉ξ( ✿＞◡❛)',
					text: `有種就選最難的`,
					actions: [
						{ label: '參加炸彈挑戰', type: 'uri', uri: 'line://app/1605575807-GW74jmBn' },
						{ label: '我要參加', type: 'message', text: '小雷我要參加' }
					]
				}
			});
		}
	},
	{
		type: '小雷我要參加',
		onCommand: async (context) => {
			const { channel, user } = context;
			let bomb = await Core.findBomb(channel, [ 'STARTED' ]);
			if (!bomb) {
				return context.replyText([ 'Rex：三小啦', `沒有炸彈了！！` ]);
			}
			if (await bomb.isJoined(user)) {
				return context.replyText([ 'Rex：三小啦', `你已經參加了！！` ]);
			}
			bomb = await Core.joinPlayer(bomb, user);
			const players = await bomb.getPlayers();
			context.replyText(`參加的人：\n${_.map(players, 'displayName').join('\n')}`);
		}
	},
	{
		type: '小雷我到了',
		onCommand: async (context) => {
			const { channel, user } = context;
			let bomb = await Core.findBomb(channel, [ 'STARTED' ]);
			bomb = await Core.inactivateBomb(bomb, user);
			const activate = await bomb.getActivate();
			context.replyText(`${user.displayName}已解除炸彈`);
			!_.isEmpty(activate) && context.replyText(`尚未拆彈：\n${_.map(activate, 'displayName').join(', ')}`);
		}
	},
	{
		type: '強制引爆',
		onCommand: async (context) => {
			const { channel } = context;
			const bomb = await Core.findBomb(channel);
			await Core.handleBomb(bomb);
		}
	},
	{
		type: 'List Jobs',
		onCommand: async (context) => {
			const jobs = Core.listJobs();
			context.replyText('Jobs:\n' + Object.keys(jobs).join('\n'));
		}
	}
];
