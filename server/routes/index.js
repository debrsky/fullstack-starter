const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	const counter = (req.session.counter ?? 0) + 1;
	req.session.counter = counter;
	res.render('index', {title: 'Express', counter});
});

module.exports = router;
