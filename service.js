import { middleware } from '@line/bot-sdk';
import express from 'express';
import path from 'path';
import _ from 'lodash';
import moment from 'moment';
import beautify from 'json-beautify';
import Core from './lib';
import BotContext from './lib/bot-context';
import handlers from './lib/bot-command-handler';

const lineConfig = {
	channelAccessToken: process.env.HEROKU_LINE_CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.HEROKU_LINE_CHANNEL_SECRET
};
const { client } = Core;
const app = express();

async function handleEvent(event) {
	const { type, source, replyToken, message } = event;
	const info = await catchProfile(source);

	switch (type) {
		case 'message': {
			switch (message.type) {
				case 'text':
					return handleText(info, message, replyToken);
			}
		}
		case 'postback': {
			return handlePostBack(info, event.postback, replyToken);
		}
	}
}

async function handleText(info, message, replyToken) {
	const { channel, user } = info;
	const type = typing(message.text);
	const context = new BotContext({ client, channel, user, replyToken, message });
	const handler = _.find(handlers, { type });

	handler && (await handler.onCommand(context));

	return context.reply();
}

function handlePostBack(info, postback, replyToken) {
	const { data, params } = postback;

	if (data === 'DATETIME') {
		const dt = moment(params.datetime);
		const message = { text: `小雷裝炸彈:PostBack ${dt.format('YYYY-MM-DD HH:mm')}` };
		return handleText(info, message, replyToken);
	}

	// const query = _(data).split('&').map(_.partial(_.split, _, '=', 2)).fromPairs().value();
	// switch (query.action) {
	// 	case 'join':
	// 		break;
	// }
	// return replyText(replyToken, `query: ${beautify(query, null, 2, 25)}`);
}

async function catchProfile(source) {
	const profile = await getProfile(source);
	const user = await Core.registerUser(profile);
	const channel = await Core.registerChannel(source);

	await channel.join(user);

	return { channel, user };
}

async function getProfile(source) {
	const { type, userId, roomId, groupId } = source;
	const key = roomId || groupId;
	switch (type) {
		case 'user':
			return await client.getProfile(userId);
		case 'room':
			return await client.getRoomMemberProfile(key, userId);
		case 'group':
			return await client.getGroupMemberProfile(key, userId);
	}
}

function typing(cmd) {
	switch (cmd) {
		case '小雷':
		case '小雷吃大便':
		case '小雷我到了':
		case '小雷啟動炸彈':
		case '小雷我要參加': {
			return cmd;
		}
		default: {
			if (cmd.indexOf('小雷裝炸彈') == 0) return '小雷裝炸彈';
			if (cmd.indexOf('系統指令') == 0 && cmd.includes('爆炸')) return '強制引爆';
			if (cmd.indexOf('系統指令') == 0 && cmd.includes('List Jobs')) return 'List Jobs';
			return undefined;
		}
	}
}

app.post('/', middleware(lineConfig), (req, res) => {
	Promise.all(req.body.events.map(handleEvent)).then((result) => {
		res.json(result);
	});
});

app.use(express.static(path.resolve(__dirname, '.', 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '.', 'build', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`listening on ${port}`);
});
