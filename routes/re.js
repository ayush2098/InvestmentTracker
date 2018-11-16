var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');
var userid;
// GET login page.
router.get('/', function(req, res, next) {
	if(req.session.user == 1) {
		userid = req.session.id;
		var con = mysql.createConnection({
			host: 'localhost',
			user: creds.creds[0].username,
			password: creds.creds[0].password,
			database: 'portfolio'
		});

		con.connect(function(err) {
			if(err) throw err;
			var sql = 'SELECT * FROM real_estate WHERE uid = ' + userid;
			con.query(sql, function(err, result) {
				if(err) throw err;

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["type"] = result[i].type;
					ob["area"] = result[i].area;
					ob["loc"] = result[i].loc;
					ob["bdate"] = result[i].buying_date;
					ob["price"] = result[i].price;

					vdata.push(ob);
				}
				res.render('re', { title: 'Real Estate', uid: userid, vdata: vdata });
			});

		});
	} else {
		res.redirect('/login');
	}
});

router.post('/delete', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		var sql = "DELETE FROM real_estate WHERE uid="+userid;
		con.query(sql, function(err, result) {
			if(err) throw err;
			else{
				res.redirect('/re');
			}
		});
	});
});


router.post('/addRE', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		var rid;
		var sqll = "Select max(rid) as rid from real_estate;";
		con.query(sqll, function(err, result) {
			rid = result[0].rid;
			var sql = "INSERT INTO real_estate VALUES("+parseInt(rid+1)+","+userid+",'"+req.body.type+"',"+req.body.area+",'"+req.body.loc+"','"+req.body.date+"',"+req.body.price+");";
			console.log(sql);
			con.query(sql, function(err, result) {
				if(err)  {
					throw err;
				}
				else {
					res.redirect('/re');
				}
			});
		});
	});
});

module.exports = router;
