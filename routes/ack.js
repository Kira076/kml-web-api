var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json({ response: 'acknowledged' });
  });

module.exports = router;