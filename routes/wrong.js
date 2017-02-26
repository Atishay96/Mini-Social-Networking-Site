var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
  res.render('wrong', { title: 'Wrong Password' });
});

module.exports = router;