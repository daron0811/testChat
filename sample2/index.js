var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: 1605432630,
  channelSecret: e59648e6ae51978c3eb51ff7f7327725,
  channelAccessToken: AFF9LdEhRoDF4Qtc90vNjYklLIcN1PBVwm2feIaewKQ4s+N7rB+YBTuR8ovs2s2qlaXRjKdtygmq/uNwmIqyUhy0wGAsub/1/5ojaUx+QPLj8JRB8RRpRIIyjTtifIWuxNN15yIpemfJO1n+mpW5PgdB04t89/1O/w1cDnyilFU=
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});