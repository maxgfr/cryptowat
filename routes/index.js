var express = require('express');
var router = express.Router();

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

router.post('/', function(req, res, next) {
    //console.log(req.body.input);
    conversation.message({
        input: { text: req.body.input},
        workspace_id: 'd2fc90d8-c914-4705-bbc7-1b5175ab4066'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
           //console.log(response.output.text);
           res.send(response.output.text);
       }
   });
});

router.post('/wabhook', function(req, res, next) {

});

module.exports = router;
