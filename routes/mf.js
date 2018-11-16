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
			var sql = 'SELECT * FROM mutual_fund WHERE uid = ' + userid;
			con.query(sql, function(err, result) {
				if(err) throw err;

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["company"] = result[i].company_name;
					ob["principal"] = result[i].principal;
					ob["rate"] = result[i].rate;
					ob["bdate"] = result[i].buying_date;

					vdata.push(ob);
				}
				res.render('mf', { title: 'MutualFunds', uid: userid, vdata: vdata });
			});

		});
	} else {
		res.redirect('/login');
	}
});


router.post('/addMF', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		var fid;
		var sqll = "Select max(fid) as fid from mutual_fund;";
		con.query(sqll, function(err, result) {
			fid = result[0].fid;
			var sql = "INSERT INTO mutual_fund VALUES("+parseInt(fid+1)+","+userid+",'"+req.body.company+"',"+req.body.principal+","+req.body.rate+",'"+req.body.date+"');";
			console.log(sql);
			con.query(sql, function(err, result) {
				if(err)  {
					throw err;
				}
				else {
					res.redirect('/mf');
				}
			});
		});
	});
});
module.exports = router;
