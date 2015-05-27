var express = require('express');
var router = express.Router();



router.get('/:room', function(req, res, next) {

  res.render('index',
    {

      room: req.params.room,
      sender: req.query.sender
    }
  );
});


module.exports = router;
