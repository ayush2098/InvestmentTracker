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
			var sql = 'SELECT * FROM misc_exp WHERE uid = ' + userid;
			con.query(sql, function(err, result) {
				if(err) throw err;

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["name"] = result[i].name;
					ob["desc"] = result[i].description;
					ob["amt"] = result[i].amount;
					ob["bdate"] = result[i].buying_date;

					vdata.push(ob);
				}
				res.render('misc', { title: 'Miscellaneous', uid: userid, vdata: vdata });
			});

		});
	} else {
		res.redirect('/login');
	}
});


router.post('/addMisc', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		var mid;
		var sqll = "Select max(mid) as mid from misc_exp;";
		con.query(sqll, function(err, result) {
			mid = result[0].mid;
			var sql = "INSERT INTO misc_exp VALUES("+parseInt(mid+1)+","+userid+",'"+req.body.name+"','"+req.body.desc+"',"+req.body.amt+",'"+req.body.date+"');";
			console.log(sql);
			con.query(sql, function(err, result) {
				if(err)  {
					throw err;
				}
				else {
					res.redirect('/misc');
				}
			});
		});
	});
});

module.exports = router;
