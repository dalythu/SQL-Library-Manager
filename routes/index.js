var express = require('express');
var router = express.Router();

// route root route to books page
router.get('/', function(req, res, next) {
  res.redirect('/books')
});

module.exports = router;
