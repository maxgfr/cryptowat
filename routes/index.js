var express = require('express');
var router = express.Router();
var CoinMarketCap = require("node-coinmarketcap");
var cm = new CoinMarketCap();

let context;
let value;

/* GET home page. */
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

router.post('/webhook', function(req, res, next) {
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

module.exports = router;
