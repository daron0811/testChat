'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const beautify = require("json-beautify");
const Parse = require('parse/node');

//Parse settings
Parse.initialize('AppId', '', 'MasterKey');
Parse.serverURL = 'https://spe3d.herokuapp.com/parse';

const Channel = Parse.Object.extend('Channel');
const User = Parse.Object.extend('SpeUser');

const Buy = Parse.Object.extend('Buy');
const BuyItem = Parse.Object.extend('BuyItem');
//

//line setting
var channelId = '1605432630';
var channelSecret = 'e59648e6ae51978c3eb51ff7f7327725';
var channelAccessToken = 'AFF9LdEhRoDF4Qtc90vNjYklLIcN1PBVwm2feIaewKQ4s+N7rB+YBTuR8ovs2s2qlaXRjKdtygmq/uNwmIqyUhy0wGAsub/1/5ojaUx+QPLj8JRB8RRpRIIyjTtifIWuxNN15yIpemfJO1n+mpW5PgdB04t89/1O/w1cDnyilFU=';

// create LINE SDK config from env variables
const config = {
  channelAccessToken: channelAccessToken,
  channelSecret: channelSecret,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/', line.middleware(config), function (req, res) {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(function (result) {
      res.json(result);
    });
});


var tools = require('./console');


// event handler
function handleEvent(event) {

  console.log(beautify(event, null, 2, 80));
  const { type, source, replyToken, message } = event;

  console.log(tools.foo); // => 'function'
  console.log(tools.bar); // => 'function'
  console.log(tools.zemba); // => undefined

  switch (type) {
    case 'message':
      catchProfile(source, replyToken);

      switch (message.type) {
        case 'text':
          return handleText(message, replyToken, source);
        // case 'image':
        //   return handleImage(message, replyToken);
        // case 'video':
        //   return handleVideo(message, replyToken);
        // case 'audio':
        //   return handleAudio(message, replyToken);
        case 'location':
        // return handleLocation(message, replyToken);
        // case 'sticker':
        //   return handleSticker(message, replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      registerChannel(source, replyToken);
      return replyText(replyToken, `Joined ${source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':


    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }

}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

function replyText(replyToken, message) {
  console.log('replyToken', replyToken);
  console.log('message', message);
  client.replyMessage(replyToken, message);
}

async function catchProfile(source, replyToken) {
  const { type, roomId, groupId } = source;
  const key = roomId || groupId;
  const queryUser = new Parse.Query(User);
  const queryChannel = new Parse.Query(Channel);

  // const profile = await client.getProfile(source.userId);
  const profile = await client.getGroupMemberProfile(groupId, source.userId);
  {
    // console.log('Profile:', beautify(profile, null, 2, 80));
  }

  let user = await queryUser.equalTo('userId', profile.userId).first();
  {
    !user && (user = new User());
    user = await user.save(profile);
    // console.log('User:', beautify(user, null, 2, 80));
  }

  let channel = await queryChannel.equalTo('key', key).first();
  {
    if (channel) {
      const relation = channel.relation('member');

      relation.add(user);
      channel = await channel.save({ replyToken });
      // console.log('Relation Channel:', beautify(channel.toJSON(), null, 2, 80));
    }
  }
}

async function registerChannel(source, replyToken) {
  const { type, roomId, groupId } = source;

  if (type === 'user') return;

  const key = roomId || groupId;

  let channel = new Channel();

  channel = await channel.save({ type, key, replyToken });
}

async function handleText(message, replyToken, source) {

  var profile;
  if (source.type === 'group') {
    profile = await client.getGroupMemberProfile(source.groupId, source.userId);
  }
  else {
    profile = client.getProfile(source.userId);
  }

  console.log('console ' + profile);
  var speakUser = profile.displayName;

  switch (message.text) {
    case '+1':
      followBuy(profile, replyToken, source, 1);
      break;
    case '統計':
      totalQuantity(event);
      break;
    case '.':
      // console.log('send mes');
      var mes = {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
          "type": "carousel",
          "columns": [
            {
              "thumbnailImageUrl": "https://scontent.ftpe8-3.fna.fbcdn.net/v/t1.0-9/41662428_2094855860830973_8167305729854668800_n.jpg?_nc_cat=100&oh=8a57b9df785fd0162992fcf356da6afd&oe=5C27E3B9",
              "imageBackgroundColor": "#FFFFFF",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "https://www.jinse.com/blockchain/169865.html"
              },
              "actions": [

                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "https://www.jinse.com/blockchain/169865.html"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://img.jinse.com/635461_image1.png",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "https://www.jinse.com/blockchain/169827.html"
              },
              "actions": [

                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "https://www.jinse.com/blockchain/169827.html"
                }
              ]
            }
          ]
        }
      };
      replyText(replyToken, mes);
    // event.reply(mes);
  }

  var res = message.text.split("-");
  var output = 'text ';
  if (res.length >= 2) {
    if (res[0] == "開團" || res[0] == "團購") {
      openBuy(source, replyToken, res[1], res[2]);
    }
    else if (res[0] == "圖") {
      replySticker(replyToken, res[1], res[2]);
    }
}
}

async function replySticker( replyToken,packageId,stickerId)
{
    var message = {
      "type": "sticker",
      "packageId": packageId,
      "stickerId": stickerId
    }
    client.replyMessage(replyToken,message );
}

async function followBuy(profile, replyToken, source, itemCount, itemName = undefined, description = "") {

  const { roomId, groupId } = source;
  const key = roomId || groupId;

  const queryUser = new Parse.Query(User);
  const queryChannel = new Parse.Query(Channel);
  const owner = profile;

  //還沒完成的

  let user = await queryUser.equalTo('userId', owner.userId).first();
  let channel = await queryChannel.equalTo('key', key).first();
  console.log('channel :', channel);
  const querybuy = new Parse.Query(Buy);
  {
    querybuy.equalTo("isCompleted", false);
    querybuy.equalTo("channel", channel);
  }
  var mesg = {
    type: 'text',
    text: '你好請問我們認識嗎?'
  };
  const results = await querybuy.find();
  var buy = null;
  console.log("have " + results.length + " scores.");
  if (results.length == 0) {
    // event.reply('現在沒有團哦！');
    return;
  }
  else if (results.length == 1) {
    buy = await querybuy.first();
  } else {
    // Do something with the returned Parse.Object values
    var resultList;
    for (let i = 0; i < results.length; i++) {
      var object = results[i];
      console.log(object.id + ' - ' + object.get('playerName'));

      var objItem = {
        "thumbnailImageUrl": "https://scontent.ftpe8-3.fna.fbcdn.net/v/t1.0-9/41662428_2094855860830973_8167305729854668800_n.jpg?_nc_cat=100&oh=8a57b9df785fd0162992fcf356da6afd&oe=5C27E3B9",
        "imageBackgroundColor": "#FFFFFF",
        "title": results[i].get("itemName"),
        "text": results[i].get("description"),
        "defaultAction": {
          "type": "uri",
          "label": "View detail",
          "uri": "https://www.jinse.com/blockchain/169865.html"
        },
        "actions": [
          {
            "type": "message",
            "label": "＋１",
            "text": "+1-" + results[i].get("itemName")
          }
        ]
      }

      console.log('objItem', objItem);
      resultList.push(objItem);
    }
    event.reply('現在有' + results.length + '團哦！');

    replyText(replyToken, mesg);
    setTimeout(function () {

      var content;
      for (var i = 0; i < resultList; i++) {
        content += resultList[i];

        if (i != resultList.length - 1) {
          content += ",";
        }
      }

      var mes = {
        "type": "template",
        "altText": "現在有開團的項目如下",
        "template": {
          "type": "carousel",
          "columns": [
            content
          ]
        }
      };
      replyText(replyToken, mes);

    }, 500);
    return;
  }
  console.log('buy :', buy);

  let buyItem = new BuyItem()

  buyItem = await buyItem.save({
    owner: user,
    itemName: itemName ? itemName : buy.get('itemName'),
    description: description,
    isPay: false,
    quantity: itemCount
  });

  const buyItems = buy.relation('buyItems');
  buyItems.add(buyItem);
  await buy.save();

  console.log('buy :', beautify(buyItem.toJSON(), null, 2, 80));

  // event.reply(owner.displayName + '點了' + itemCount + '份' + buy.get('itemName') + '!\n' + '加入了團購行列～');
}


async function openBuy(source, replyToken, itemName, description = undefined) {
  console.log("start open buy");
  const { type, roomId, groupId, userId } = source;
  const key = roomId || groupId;

  const querybuy = new Parse.Query(Buy);
  // const queryBuyItem  = new Parse.Query(BuyItme);
  const queryUser = new Parse.Query(User);
  const queryChannel = new Parse.Query(Channel);
  const owner = await client.getGroupMemberProfile(groupId, userId);

  console.log('1. owner:', owner);

  let user = await queryUser.equalTo('userId', owner.userId).first();

  let channel = await queryChannel.equalTo('key', key).first();

  let buy = await querybuy.equalTo('itemName', itemName).equalTo('channel', channel).first();
  {
    if (buy != null && buy.get('isCompleted') == false) {

      var content = buy.get('itemName') + '正在開團中哦～';
      var mesg = {
        type: 'text',
        text: content
      };
      replyText(replyToken, mesg);
      // event.reply();
      return;
    }

    !buy && (buy = new Buy()); //如果沒有buy 建立一個

    buy.set('ownerId', owner.userId);
    buy.set('itemName', itemName);
    buy.set('description', description);
    buy.set('isCompleted', false);
    buy.set('owner', user);
    buy.set('channel', channel);

    buy.set('buyItem', null)

    buy = await buy.save();
    console.log('buy :', beautify(buy.toJSON(), null, 2, 80));
  }



  var speakUser = owner.displayName;
  var out = speakUser + ' 發起團購' + itemName + '\n價格是' + description + '\n要參與的快來喊+1';
  console.log(out);

  var replymessage = {
    "type": "template",
    "altText": speakUser + ' 發起團購',
    "template": {
      "type": "buttons",
      "thumbnailImageUrl": "https://i.imgur.com/xtoLyW2.jpg",
      "imageAspectRatio": "rectangle",
      "imageSize": "cover",
      "imageBackgroundColor": "#FFFFFF",
      "title": itemName,
      "text": "Please select",
      "defaultAction": {
        "type": "uri",
        "label": "View detail",
        "uri": "http://example.com/page/123"
      },
      "actions": [
        {
          "type": "postback",
          "label": "＋１",
          "text": "+1",
          "data": "+1 " + itemName + " " + owner
        },
        {
          "type": "postback",
          "label": "結束團購",
          "text": "結束團購",
          "data": "結束團購 " + owner
        }
        // ,
        // {
        //   "type": "uri",
        //   "label": "View detail",
        //   "uri": "http://example.com/page/123"
        // }
      ]
    }
  }


  // {
  //   "type": "template",
  //   "altText": "發起團購了～",
  //   "template": {
  //     "type": "buttons",
  //     "imageAspectRatio": "rectangle",
  //     "imageSize": "contain",
  //     "thumbnailImageUrl": "https://i.imgur.com/xtoLyW2.jpg",
  //     "imageBackgroundColor": "#a8e8fb",
  //     "title": itemName,
  //     "text": description,
  //     "defaultAction": {
  //       "type": "message",
  //       "label": "點這會幹嘛?",
  //       "text": "點這會幹嘛?"
  //     },
  //     "actions": [
  //       {
  //         "type": "message",
  //         "label": "＋１",
  //         "text": "+1"
  //       },
  //       {
  //         "type": "message",
  //         "label": "結束團購",
  //         "text": "結束團購"
  //       }
  //     ]
  //   }
  // }
  replyText(replyToken, replymessage);
  // event.reply(replymessage);
  console.log(out);
}

/*
var linebot = require('linebot');
var line = require('@line/bot-sdk');
var express = require('express');


//parse test
var Parse = require('parse/node');

Parse.initialize('AppId', '', 'MasterKey');
Parse.serverURL = 'https://spe3d.herokuapp.com/parse';

// const Group = Parse.Object.extend('SpeGroup');
// const User = Parse.Object.extend('SpeUser');



/////

var channelId = '1605432630';
var channelSecret = 'e59648e6ae51978c3eb51ff7f7327725';
var channelAccessToken = 'AFF9LdEhRoDF4Qtc90vNjYklLIcN1PBVwm2feIaewKQ4s+N7rB+YBTuR8ovs2s2qlaXRjKdtygmq/uNwmIqyUhy0wGAsub/1/5ojaUx+QPLj8JRB8RRpRIIyjTtifIWuxNN15yIpemfJO1n+mpW5PgdB04t89/1O/w1cDnyilFU=';

var bot = linebot({
  channelId: channelId,
  channelSecret: channelSecret,
  channelAccessToken: channelAccessToken
});

const client = new line.Client({
  channelAccessToken: 'AFF9LdEhRoDF4Qtc90vNjYklLIcN1PBVwm2feIaewKQ4s+N7rB+YBTuR8ovs2s2qlaXRjKdtygmq/uNwmIqyUhy0wGAsub/1/5ojaUx+QPLj8JRB8RRpRIIyjTtifIWuxNN15yIpemfJO1n+mpW5PgdB04t89/1O/w1cDnyilFU='
});

//加入群組資訊
bot.on('join', function (event) {
  const { source, replyToken } = event;
  registerChannel(source, replyToken);
  var replymessage = '加入群組';
  event.reply(replymessage);
}
);

bot.on('postback', function (event) {
  // var replymessage ='加入群組';
  // event.reply(replymessage);
  // console.log(event);
  // event.reply('postback:' + event);
});

//發訊息
bot.on('message', async function (event) {

  const { source, message, replyToken } = event;

  catchProfile(source, replyToken);

  var profile;
  if (source.type === 'group') {
    profile = await client.getGroupMemberProfile(source.groupId, source.userId);
  }
  else {
    profile = client.getProfile(event.source.userId);
  }

  if (message.type == 'text') {
    var res = message.text.split("-");
    var output = 'text ';

    var speakUser = profile.displayName;

    switch (message.text) {
      case '+1':
        followBuy(profile, event, 1);
        break;
      case '統計':
        totalQuantity(event);
        break;
      case '.':
        console.log('send mes');
        var mes = {
          "type": "template",
          "altText": "this is a carousel template",
          "template": {
            "type": "carousel",
            "actions": [],
            "columns": [
              {
                "thumbnailImageUrl": "http://cliparting.com/wp-content/uploads/2016/06/Snoopy-happy-new-year-clipart-clipart-free-clipart-microsoft-image.png",
                "title": "          Happy New Year",
                "text": "         Happy 2018 Event",
                "actions": [
                  {
                    "type": "message",
                    "label": "New Year Promotion",
                    "text": "New Year Promotion"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://ssl.pstatic.net/linefriends/wp-content/uploads/2017/03/char_choco_name.png",
                "title": "      New Character Choco",
                "text": "       New Character Event",
                "actions": [
                  {
                    "type": "message",
                    "label": "New Character Promotion",
                    "text": "New Character Promotion"
                  }
                ]
              },
              {
                "thumbnailImageUrl": "https://ssl.pstatic.net/linefriends/wp-content/uploads/2017/03/char_pc_top.jpg",
                "title": "          New Open Store",
                "text": "            Opening Event",
                "actions": [
                  {
                    "type": "message",
                    "label": "New Store Promotion",
                    "text": "New Store Promotion"
                  }
                ]
              }
            ]
          }
        };

        event.reply(mes);
        break
      default:
        break;
    }

    if (res.length >= 2) {
      if (res[0] == "開團" || res[0] == "團購") {
        openBuy(event, res[1], res[2]);
      }
    }


  }
}
);

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});



async function totalQuantity(event) {
  const queryChannel = new Parse.Query(Channel);
  let channel = await queryChannel.equalTo('key', key).first();

  const queryBuy = new Parse.query(Buy);
  {
    queryBuy.equalTo("isCompleted", false);
    queryBuy.equalTo("channel", channel);
  }

  const buy = await querybuy.first();
  console.log('buy : ', buy);


}

*/