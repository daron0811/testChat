import _ from 'lodash';

export default class BotContext {
	constructor(data) {
		Object.assign(this, data);
		this.messages = [];
	}

	replyText(texts) {
		texts = Array.isArray(texts) ? texts : [ texts ];
		texts.map((text) => ({ type: 'text', text })).forEach(this.replyMessage.bind(this));
	}

	replyMessage(message) {
		this.messages.push(message);
	}

	reply() {
		if (_.isEmpty(this.messages)) return;
		return this.client.replyMessage(this.replyToken, this.messages);
	}
}
