var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var creds = require('../app');

// GET login page.
router.get('/', function(req, res, next) {
	req.session.id = "";
	req.session.user = 0;
	req.session.emp = 0;
	res.render('login', { title: 'Login' });

});

// POST from login page.
router.post('/verify', function(req, res, next) {
	// Verify login crendentials from DB.
	console.log(creds.creds[0].username);
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to database');
		console.log(req.body.username);
		var sql = 'SELECT pwd FROM user WHERE uid = ' + req.body.username;
		con.query(sql, function(err, result) {
			if(err) throw err;
			if(result=='') {
				res.render('login', { title: 'Login', value: 1 });
				return;
			}

			var reqPass = String(req.body.pwd);
			var resPass = result[0].pwd;

			if(resPass === reqPass) {
				console.log('True');
				req.session.user = 1;
				req.session.id = req.body.username;
				res.redirect('/homeUser');
			}
			else {
				console.log('False')
				res.render('login', { title: 'Login', value: 1 });
			}
		});
		//con.end();
	});
});
module.exports = router;
