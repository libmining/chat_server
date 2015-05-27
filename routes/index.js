var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index',
    {
      sender: req.query.sender,
      room: req.query.room
    }
  );
});


router.get('/:room', function(req, res, next) {

  res.render('index',
    {

      room: req.params.room,
      me: req.query.me
    }
  );
});


module.exports = router;
