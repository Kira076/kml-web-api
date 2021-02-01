var express = require('express');
var router = express.Router();

router.get('/:comp', function(req, res, next) {
    var component = req.params.comp;
    res.json({component: component});
  });

module.exports = router;