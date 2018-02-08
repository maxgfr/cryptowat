var express = require('express');
var router = express.Router();
var http = require('http');
var CoinMarketCap = require("node-coinmarketcap");
var cm = new CoinMarketCap();
var context_array = [];
var number = 0;
var context = null;

router.get('/',function(req, res, next) {
    if(!conversation) {
        console.log("Conversation non initialisée");
        res.render('error');
    } else {
        console.log("Conversation initialisée");
        res.render('index', { conversation: conversation});
    }
});

router.post('/',function(req, res, next) {
    //console.log(req.body.input);
    //console.log(context);
    conversation.message({
        input: { text: req.body.input},
        context: context_array[context_array.length-1] ,
        workspace_id: '6282828d-f95c-4889-8781-614fcfbaac44'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
            //console.log(response);
            var rep = response.output.text;
            var node_visited = response.output.nodes_visited;
            /*SAVE CONTEXT*/
            context = response.context;
            context_array[number] = response.context;
            number++;
            /*SAVE CONTEXT*/
            //console.log(context);
            if (context.cryptocurrency != null && context.period  != null) {
                cm.get(context.cryptocurrency, data => {
                  //console.log(data);
                  //console.log(data.price_usd); // Prints the price in USD of BTC at the moment.
                  var name = data.name;
                  var marketcap = data.market_cap_usd;
                  var price_usd = data.price_usd;
                  var period = 'none';
                  var value;
                  var result;
                  //console.log(data);
                  if(context.period == "weekly") {
                      value = data.percent_change_7d;
                      period = '7 days';
                  }
                  if (context.period  == "daily") {
                      value = data.percent_change_24h;
                      period = '24 hours';
                  }
                  if (context.period  == "hourly"){
                      value = data.percent_change_1h;
                      period = 'hour';
                  }
                  if(Math.sign(value) == 1) { //positive
                      result = 'The last '+period+', the price of '+name+' increased by '+value+'%. Now, its price is: '+price_usd+'$. 😄';
                  } else {
                      result = 'The last '+period+', the price of '+name+' fell to '+value+'%. Now, its price is: '+price_usd+'$. 😄';
                  }
                  //console.log(result);
                  res.send([result]);
                });
            }
             else {
                 if (context.cryptocurrency != null) {
                     cm.get(context.cryptocurrency, data => {
                       var result = 'The price of '+data.name+' is: '+data.price_usd+'$. 😊';
                       res.send([result]);
                     });
                 } else {
                    res.send([rep]);
                 }
            }

        }
    });
});

router.get('/privacy',function(req, res, next) {
    res.render('policy');
});

/*
router.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'cryptop') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
});

router.post('/webhook/', function (req, res, next) {
    let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;
		if (event.message && event.message.text) {
			let text = event.message.text;
            console.log('USER said :',text);
            sendTextMessage(sender, text);
		}
	}
	res.sendStatus(200);
});

function sendTextMessage(sender, text) {
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
                url: 'https://graph.facebook.com/v2.11/me/messages',
                qs: {access_token:"EAACDSnyANdIBAC5xSdhgwZAyZBWchOdtQJWIznDHYWQTkDAPcEQLq9NesmMCJ8Bl9ZAbJ2mN3FNSOXdgOSBoy24jSZAuR3tZAtwvUT3OW7FYysuVlE6yHLydLG1AIJm59MaedLmQgKSuXdGaQLb9zh1FQb5s1Evwj1BUnUDiqWwZDZD"},
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
*/

module.exports = function(bot) {
    bot.on('message', function(userId, message){
        console.log('CHATBOT CONTEXT', context);
        conversation.message({
            input: { text: message},
            context: context_array[context_array.length-1],
            workspace_id: '6282828d-f95c-4889-8781-614fcfbaac44'
        }, function(err, response) {
            if (err) {
               console.error(err);
           } else {
                console.log(response);
                var messageData;
                var rep = response.output.text;
                var node_visited = response.output.nodes_visited;
                /*SAVE CONTEXT*/
                context = response.context;
                context_array[number] = response.context;
                number++;
                /*SAVE CONTEXT*/
                console.log('NUMBER' ,number);
                if (context.cryptocurrency != null && context.period  != null) {
                    cm.get(context.cryptocurrency, data => {
                      var name = data.name;
                      var marketcap = data.market_cap_usd;
                      var price_usd = data.price_usd;
                      var period = 'none';
                      var value;
                      var result;
                      if(context.period == "weekly") {
                          value = data.percent_change_7d;
                          period = '7 days';
                      }
                      if (context.period  == "daily") {
                          value = data.percent_change_24h;
                          period = '24 hours';
                      }
                      if (context.period  == "hourly"){
                          value = data.percent_change_1h;
                          period = 'hour';
                      }
                      if(Math.sign(value) == 1) { //positive
                          result = 'The last '+period+', the price of '+name+' increased by '+value+'%. Now, its price is: '+price_usd+'$. 😄';
                      } else {
                          result = 'The last '+period+', the price of '+name+' fell to '+value+'%. Now, its price is: '+price_usd+'$. 😄';
                      }
                      bot.sendTextMessage(userId, result);
                    });
                } else {
                    if (context.cryptocurrency != null) {
                        cm.get(context.cryptocurrency, data => {
                            var result = 'The price of '+data.name+' is: '+data.price_usd+'$. 😊';
                            bot.sendTextMessage(userId, result);
                        });
                    } else {
                       bot.sendTextMessage(userId, rep[0]);
                    }
               }
            }
        });
    });
    return router;
};
