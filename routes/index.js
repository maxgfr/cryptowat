var express = require('express');
var router = express.Router();
var coinmarketcap = require("coinmarketcap");
global.fetch = require('node-fetch');

let context;
let value;

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!conversation) {
        console.log("Conversation non initialisée");
        res.render('error');
    } else {
        console.log("Conversation initialisée");
        res.render('index', { conversation: conversation});
    }
});

router.post('/',async function(req, res, next) {
    //console.log(req.body.input);
    conversation.message({
        input: { text: req.body.input},
        context: context,
        workspace_id: '3ca0aa0a-f518-4e60-b233-38056953fa71'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
           console.log(response);
           callPrice(response);
       }
    });
    async function callPrice(response) {
        var rep = response.output.text;
        context = response.context;
        if (context.currency != null && context.period != null) {
            var data =  await coinmarketcap.tickerByAsset(context.currency);
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
        }
        res.send([rep]);
    }
});

router.post('/wabhook', function(req, res, next) {
    //console.log(req.body.input);
    conversation.message({
        input: { text: req.body.input},
        context: context,
        workspace_id: '3ca0aa0a-f518-4e60-b233-38056953fa71'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
           console.log(response);
           callPrice(response);
       }
    });
    async function callPrice(response) {
        var rep = response.output.text;
        context = response.context;
        if (context.currency != null && context.period != null) {
            var data =  await coinmarketcap.tickerByAsset(context.currency);
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
        }
        res.send([rep]);
    }
});

module.exports = router;
