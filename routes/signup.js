var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');

// GET login page.
router.get('/', function(req, res, next) {
	res.render('signup', { title: 'Sign Up'});
});

router.post('/submitUser', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		var sql = "INSERT INTO user VALUES("+req.body.usrid+",'"+req.body.nm+"','"+req.body.pwd+"',0,'"+req.body.email+"','"+req.body.phno+"');";
		con.query(sql, function(err, result) {
			if(err)  {
				// throw err;
				console.log("Already Exists !!");
				res.render('signup', { title: 'Sign Up',value: 2, retry: 'true' });
			}
			else {
				res.redirect('/login');
		}
		});
	});
});

module.exports = router;
