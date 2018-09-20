var linebot = require('linebot');
const line = require('@line/bot-sdk');
var express = require('express');


//parse test
var Parse = require('parse/node');

Parse.initialize("myAppId","");
Parse.serverURL = 'https://spe3d.herokuapp.com/parse';


/////



var bot = linebot({
  channelId: '1605432630',
  channelSecret: 'e59648e6ae51978c3eb51ff7f7327725',
  channelAccessToken: 'AFF9LdEhRoDF4Qtc90vNjYklLIcN1PBVwm2feIaewKQ4s+N7rB+YBTuR8ovs2s2qlaXRjKdtygmq/uNwmIqyUhy0wGAsub/1/5ojaUx+QPLj8JRB8RRpRIIyjTtifIWuxNN15yIpemfJO1n+mpW5PgdB04t89/1O/w1cDnyilFU='
});

const client = new line.Client({
  channelAccessToken: 'AFF9LdEhRoDF4Qtc90vNjYklLIcN1PBVwm2feIaewKQ4s+N7rB+YBTuR8ovs2s2qlaXRjKdtygmq/uNwmIqyUhy0wGAsub/1/5ojaUx+QPLj8JRB8RRpRIIyjTtifIWuxNN15yIpemfJO1n+mpW5PgdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
  console.log(" type :" + event.message.type);
  switch(event.message.type)
  {

    case 'text':
    
    if(event.message.text == "我是誰")
    {
    
    //   client.getProfile(event.source.userId)
    // .then((profile) => {
    //   console.log(profile.displayName);
    //   console.log(profile.userId);
    //   console.log(profile.pictureUrl);
    //   console.log(profile.statusMessage);
    //   event.reply('你的名字是:' + profile.displayName);

      
    // }
  
    // )
    // .catch((err) => {
    //   // error handling
    // });


    client.getGroupMemberIds(event.source.groupId)
  .then((ids) => {
    ids.forEach((id) => console.log('id : ' ,id));
  })
  .catch((err) => {
    // error handling
  });

    }
    else if(event.message.text == "分數")
    {
      const GameScore = Parse.Object.extend("GameScore");
      const gameScore = new GameScore();
      
      gameScore.set("score",2222);
      gameScore.set("playerName","DaRon Test");
      gameScore.set("cheatMode",false);
      
      gameScore.save().then((gameScore)=>
      {
        console.log('New object created with objectId: ' + gameScore.id);
      },(error) =>
      {
        console.log('Failed to create new object, with error code: ' + error.message);
      }
      );
      
      

    }

    else if(event.message.text == "取得成績")
    {
      // var GameScore = Parse.Object.extend("GameScore");
      // var query = new Parse.Query(GameScore);
      // query.get("znW24ZzBX9")
      // .then((gameScore) => {
      //   var score = gameScore.get("score");
      //   var playerName = gameScore.get("playerName");
      //   var cheatMode = gameScore.get("cheatMode");
      //   console.log('New object created with objectId: ' + score + ","+playerName+","+cheatMode);
      // }, (error) => {
      //   console.log('New object created with objectId: ' + gameScore.id);
      //   // The object was not retrieved successfully.
      //   // error is a Parse.Error with an error code and message.
      // });

      // const GameScore = Parse.Object.extend("GameScore");
      // const query = new Parse.Query(GameScore);
      // query.equalTo("playerName", "DaRon Test");

      // const results = async function(){await query.find();} 

      // console.log("Successfully retrieved " + results.length + " scores.");
      // // Do something with the returned Parse.Object values
      // for (let i = 0; i < results.length; i++) {
      //   var object = results[i];
      //   console.log(object.id + ' - ' + object.get('playerName'));
      // } 
      

      // const GameScore = Parse.Object.extend("GameScore");
      // const query = new Parse.Query(GameScore);
      // query.equalTo("playerName", "DaRon Test");

      // const object = async function()
      // {await query.first();} 

      // console.log(object.toString());

    }
    else if(event.message.text == "圖")
    {
      var message = {
        "type": "image",
        "originalContentUrl": "https://i.kym-cdn.com/photos/images/original/000/993/875/084.png",
        "previewImageUrl": "https://i.kym-cdn.com/photos/images/original/000/993/875/084.png"
      }
      event.reply(message);
    }
    else if(event.message.text == "動圖")
    {
      var message = {
        "type": "image",
        "originalContentUrl": "https://i.imgur.com/KOXOBiN.gif",
        "previewImageUrl": "https://i.imgur.com/KOXOBiN.gif"
      }
      event.reply(message);
    }
    else if(event.message.text == "影")
    {
      var message = {
        "type": "video",
        "originalContentUrl": "https://rtnvideo1.appledaily.com.tw/mcp/encode/2017/12/02/3496131/1251954_360p.mp4",
        "previewImageUrl": "https://i.kym-cdn.com/photos/images/original/000/993/875/084.png"
      }
      event.reply(message);
    }
    else if(event.message.text == "音")
    {
      var message = {
        "type": "audio",
        "originalContentUrl": "https://maoudamashii.jokersounds.com/music/se/mp3/se_maoudamashii_chime14.mp3",
        "duration": 2000
      }
      event.reply(message);
    }
    else if(event.message.text == "地")
    {
      var message = {
        "type": "location",
        "title": "我在這裡，這裡是標題",
        "address": "這裡是地址",
        "latitude": 35.65910807942215,
        "longitude": 139.70372892916203
      }
      event.reply(message);
    }
    else if(event.message.text == "圖片選項")
    {
      var message = {
        "type": "imagemap",
        "baseUrl": "https://i.imgur.com/dseILu5.jpg",
        "altText": "在不支援顯示影像地圖的地方顯示的文字",
        "baseSize": {
          "height": 1040,
          "width": 1040
        },
        "actions": [
          {
            "type": "uri",
            "linkUri": "https://www.google.com.tw/",
            "label": "google",
            "area": {
              "x": 0,
              "y": 0,
              "width": 520,
              "height": 1040
            }
          },
          {
            "type": "message",
            "text": "傳送文字",
            "area": {
              "x": 520,
              "y": 0,
              "width": 520,
              "height": 1040
            }
          }
        ]
      }
      event.reply(message);
    }
    else if(event.message.text == "是否")
    {
      var message = {
        "type": "template",
        "altText": "在不支援顯示樣板的地方顯示的文字",
        "template": {
          "type": "confirm",
          "text": "給我錢",
          "actions": [
            {
              "type": "message",
              "label": "好",
              "text": "好給你"
            },
            {
              "type": "message",
              "label": "不要",
              "text": "不要咧"
            }
          ]
        }
      }
      event.reply(message);
    }
    else if(event.message.text == "按鈕")
    {
      var message = {
        "type": "template",
        "altText": "在不支援顯示樣板的地方顯示的文字",
        "template": {
          "type": "confirm",
          "text": "給我喝水",
          "actions": [
            {
              "type": "message",
              "label": "給你喝",
              "text": "快喝"
            },
            {
              "type": "message",
              "label": "不給你喝",
              "text": "渴死你吧"
            }
          ]
        }
      }
      event.reply(message);
    }
    else if(event.message.text == "食物")
    {
      var message = {
        "type": "template",
        "altText": "在不支援顯示樣板的地方顯示的文字",
        "template": {
          "type": "buttons",
          "text": "請給我食物",
          "actions": [
            {
              "type": "message",
              "label": "香蕉",
              "text": "香蕉"
            },
            {
              "type": "message",
              "label": "蘋果",
              "text": "蘋果"
            },
            {
              "type": "message",
              "label": "芭樂",
              "text": "芭樂"
            },
            {
              "type": "message",
              "label": "不給你吃",
              "text": "不給你吃"
            }
          ]
        }
      }
      event.reply(message);
    }
    else if(event.message.text == "飲料")
    {
      var message = {
        "type": "template",
        "altText": "在不支援顯示樣板的地方顯示的文字",
        "template": {
          "type": "buttons",
          "imageAspectRatio": "rectangle",
          "imageSize": "contain",
          "thumbnailImageUrl": "https://i.imgur.com/xtoLyW2.jpg",
          "imageBackgroundColor": "#a8e8fb",
          "title": "飲料清單",
          "text": "我想喝飲料",
          "defaultAction": {
            "type": "postback",
            "label": "點這會幹嘛?",
            "data": "喝尿吧"
          },
          "actions": [
            {
              "type":"postback",
              "label":"茶",
              "data":"喝茶"
            },
            {
              "type": "postback",
              "label": "咖啡",
              "data": "喝咖啡"
            },
            {
              "type": "postback",
              "label": "啤酒",
              "data": "喝啤酒"
            },
            {
              "type": "postback",
              "label": "汽水",
              "data": "喝汽水"
            }
          ]
        }
      }
      event.reply(message);
    }
    // else if(event.message.text == "輪播")
    // {
    //   var message = {
    //     "type": "template",
    //     "altText": "在不支援顯示樣板的地方顯示的文字",
    //     "template": {
    //       "type": "carousel",
    //       "columns": [
    //         {
    //           "text": "第一組標題",
    //           "actions": [
    //             {
    //               "type": "message",
    //               "label": "第一個按鈕",
    //               "text": "1"
    //             }
    //           ]
    //         },
    //         {
    //           "text": "第二組標題",
    //           "actions": [
    //             {
    //               "type": "message",
    //               "label": "第一個按鈕",
    //               "text": "2"
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   }
    //   event.reply(message);
    // }
    else if(event.message.text == "flex")
    {
      var message = {  
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "hello"
              },
              {
                "type": "text",
                "text": "world"
              }
            ]
          }
        }
      }
      event.reply(message);
    }
    else if(event.message.text == "菜單")
    {
      var message = {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_2_restaurant.png",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": "https://linecorp.com"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "md",
          "action": {
            "type": "uri",
            "uri": "https://linecorp.com"
          },
          "contents": [
            {
              "type": "text",
              "text": "Brown's Burger",
              "size": "xl",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "icon",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_regular_32.png"
                    },
                    {
                      "type": "text",
                      "text": "$50",
                      "weight": "bold",
                      "margin": "sm",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": "400kcl",
                      "size": "sm",
                      "align": "end",
                      "color": "#aaaaaa"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "icon",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png"
                    },
                    {
                      "type": "text",
                      "text": "$55",
                      "weight": "bold",
                      "margin": "sm",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": "550kcl",
                      "size": "sm",
                      "align": "end",
                      "color": "#aaaaaa"
                    }
                  ]
                }
              ]
            },
            {
              "type": "text",
              "text": "Sauce, Onions, Pickles, Lettuce & Cheese",
              "wrap": true,
              "color": "#aaaaaa",
              "size": "xxs"
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "spacer",
              "size": "xxl"
            },
            {
              "type": "button",
              "style": "primary",
              "color": "#905c44",
              "action": {
                "type": "uri",
                "label": "Add to Cart",
                "uri": "https://linecorp.com"
              }
            }
          ]
        }
      }
    }
      event.reply(message);
      console.log(message);
    }
    // else if(event.message.text == "泡泡")
    // {
    //   var message = {
    //     "type": "bubble",
    //     "header": {
    //       "type": "box",
    //       "layout": "vertical",
    //       "contents": [
    //         {
    //           "type": "text",
    //           "text": "Header text"
    //         }
    //       ]
    //     },
    //     "hero": {
    //       "type": "image",
    //       "url": "https://example.com/flex/images/image.jpg",
    //     },
    //     "body": {
    //       "type": "box",
    //       "layout": "vertical",
    //       "contents": [
    //         {
    //           "type": "text",
    //           "text": "Body text",
    //         }
    //       ]
    //     },
    //     "footer": {
    //       "type": "box",
    //       "layout": "vertical",
    //       "contents": [
    //         {
    //           "type": "text",
    //           "text": "Footer text",
    //         }
    //       ]
    //     },
    //     "styles": {
    //       "comment": "See the example of a bubble style object"
    //     }
    //   }
    //   event.reply(message);
    // }
    //  var message = {
    //   "type": "template",
    //   "altText": "在不支援顯示樣板的地方顯示的文字",
    //   "template": {
    //     "type": "carousel",
    //     "columns": [
    //       {
    //         "text": "第一組標題",
    //         "actions": [
    //           {
    //             "type": "message",
    //             "label": "第一個按鈕",
    //             "text": "1"
    //           }
    //         ]
    //       },
    //       {
    //         "text": "第二組標題",
    //         "actions": [
    //           {
    //             "type": "message",
    //             "label": "第一個按鈕",
    //             "text": "1"
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // }

    // event.reply(message);
    break;
    
    case 'sticker':
    var message = {
      "type": "sticker",
      "packageId": (getRandomInt(2)+1).toString(),
      "stickerId": (getRandomInt(30)+1).toString()
    }

    event.reply(message);
    break;
    
    case 'video':
    event.reply('這是影片');
    break;
    
    case 'image':
    event.reply('這是圖片');
    break;
    
    case 'location':

    var message = {
      "type": "location",
      "title": "my location",
      "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
      "latitude": 35.65910807942215,
      "longitude": 139.70372892916203
    }
    event.reply(message);
    break;

    default :
    event.reply('這什麼? 我想應該是'+event.message.type);
    break;
  };
  
  // event.reply(event.message.type);
  // if(event.message.type='text')
  // {
    
  // }else if()

  // if (event.message.type = 'text') {
  //   var msg = event.message.text;
  //   event.reply(msg).then(function(data) {
  //     // success 
  //     console.log(msg);
  //   }).catch(function(error) {
  //     // error 
  //     console.log('error');
  //   });
  // }
  // else if (event.message.type = 'image') {
  //   var msg = '這是圖片ㄅ';
  //   event.reply(msg).then(function(data) {
  //     // success 
  //     console.log(msg);
  //   }).catch(function(error) {
  //     // error 
  //     console.log('error');
  //   });
  // }
  
  // event.reply(event.message.type);



});




function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});