var express = require('express');
var router = express.Router();
var http = require('http');
var CoinMarketCap = require("node-coinmarketcap");
var cm = new CoinMarketCap();

let context;
let value;

router.get('/',function(req, res, next) {
    if(!conversation) {
        console.log("Conversation non initialisée");
        res.render('error');
    } else {
        console.log("Conversation initialisée");
        context = null;
        res.render('index', { conversation: conversation});
    }
});

router.post('/',function(req, res, next) {
    //console.log(req.body.input);
    conversation.message({
        input: { text: req.body.input},
        context: context,
        workspace_id: '6282828d-f95c-4889-8781-614fcfbaac44'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
            console.log(response);
            var rep = response.output.text;
            context = response.context;
            if (context.cryptocurrency != null && context.period != null) {
                cm.get(context.cryptocurrency, data => {
                  //console.log(data);
                  console.log(data.price_usd); // Prints the price in USD of BTC at the moment.
                  var name = data.name;
                  var marketcap = data.market_cap_usd;
                  var price_usd = data.price_usd;
                  var period = 'none';
                  console.log(data);
                  if(context.period == "weekly") {
                      value = data.percent_change_7d;
                      period = '7 days';
                  }
                  if (context.period == "daily") {
                      value = data.percent_change_24h;
                      period = '24 hours';
                  }
                  if (context.period == "hourly"){
                      value = data.percent_change_1h;
                      period = 'hour';
                  }
                  var result;
                  if(Math.sign(value) == 1) { //positive
                      result = 'The last '+period+', the price of '+name+' increased by '+value+'%. Now, its price is: '+price_usd+'$.';
                  } else {
                      result = 'The last '+period+', the price of '+name+' fell to '+value+'%. Now, its price is: '+price_usd+'$.';
                  }
                  console.log(result);
                  context = null;
                  res.send([result]);
                });
            } else {
                res.send([rep]);
            }
        }
    });
});

router.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'cryptop') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
});

router.post('/webhook/', function (req, res) {
    var fb_token = "EAACDSnyANdIBAB99SZCH5rZAgfM8AH6aaZC2C7Ty3obwFD2IQvZAwe6rBGByIyZChbpcSCZBvoxkF3vv8pwsELk5xzkb6F86WaGi1cfy2vspGiB8T7aY7SmzUkRAnIpCT8FFUMmzZBX4EtaT9yl9goe8jgExvkcr0lzDgWa1uZCFiwZDZD";
	let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;
		if (event.message && event.message.text) {
			let text = event.message.text;
            console.log('USER said :',text);
			sendTextMessage(sender, text, fb_token);
		}
	}
	res.sendStatus(200);
});

function sendTextMessage(sender, text, token) {
    conversation.message({
        input: { text: req.body.input},
        context: context,
        workspace_id: '6282828d-f95c-4889-8781-614fcfbaac44'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
            console.log(response);
            var messageData;
            var rep = response.output.text;
            context = response.context;
            if (context.cryptocurrency != null && context.period != null) {
                cm.get(context.cryptocurrency, data => {
                  //console.log(data);
                  console.log(data.price_usd); // Prints the price in USD of BTC at the moment.
                  var name = data.name;
                  var marketcap = data.market_cap_usd;
                  var price_usd = data.price_usd;
                  var period = 'none';
                  console.log(data);
                  if(context.period == "weekly") {
                      value = data.percent_change_7d;
                      period = '7 days';
                  }
                  if (context.period == "daily") {
                      value = data.percent_change_24h;
                      period = '24 hours';
                  }
                  if (context.period == "hourly"){
                      value = data.percent_change_1h;
                      period = 'hour';
                  }
                  var result;
                  if(Math.sign(value) == 1) { //positive
                      result = 'The last '+period+', the price of '+name+' increased by '+value+'%. Now, its price is: '+price_usd+'$.';
                  } else {
                      result = 'The last '+period+', the price of '+name+' fell to '+value+'%. Now, its price is: '+price_usd+'$.';
                  }
                  console.log(result);
                  context = null;
                  messageData = { text:result };
                });
            } else {
                messageData = { text:rep };
            }
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {access_token:token},
                method: 'POST',
                json: {
                    recipient: {id:sender},
                    message: messageData,
                }
            }, function(error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }
            });
        }
    });
}

module.exports = router;
