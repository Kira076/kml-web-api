var express = require('express');
var router = express.Router();
var Crawler = require('../util/crawler');

router.get('/:term', async function(req, res, next) {
    var term = req.params.term;
    var instance = new Crawler(true, 150, true);
    try {
        var results = await instance.rg_search(term);
        if (results.success) {
            var endResult = {end: 'it worked', original: results};
            res.json(endResult)
        }
        else {
            var endResult = {end: 'It didn\'t work :(', original: results}
            res.json(endResults)
        }
    }
    catch(error){
        console.log(error);
    }
    
  });

module.exports = router;