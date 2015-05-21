var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index',
    {
      receiver : req.query.receiver ,
      sender : req.query.sender
    }
  );
});

module.exports = router;
