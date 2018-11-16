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
			var sql = 'SELECT * FROM stock WHERE uid = ' + userid;
			con.query(sql, function(err, result) {
				if(err) throw err;

				var vdata = [];
				for(i = 0; i < result.length; i++) {
					var ob = new Object();
					ob["company"] = result[i].company;
					ob["tname"] = result[i].t_name;
					ob["buy"] = result[i].buying_price;
					ob["curr"] = result[i].curr_price;
					ob["nstock"] = result[i].no_stocks;
					ob["bdate"] = result[i].buying_date;

					vdata.push(ob);
				}
				// console.log(data);
				console.log(vdata);

				res.render('stocks', { title: 'Stocks', uid: userid, vdata: vdata });
			});

		});
	} else {
		res.redirect('/login');
	}
});

router.post('/addStock', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'portfolio'
	});

	con.connect(function(err) {
		if(err) throw err;
		var sid;
		var sqll = "Select max(sid) as sid from stock;";
		con.query(sqll, function(err, result) {
			sid = result[0].sid;
			console.log(result);
			console.log(sid);
			var sql = "INSERT INTO stock VALUES("+parseInt(sid+1)+","+userid+",'"+req.body.company+"','"+req.body.tname+"',"+req.body.buy+","+(parseInt(parseInt(req.body.buy)+42))+","+req.body.nstock+",'"+req.body.date+"');";
			con.query(sql, function(err, result) {
				if(err)  {
					throw err;
				}
				else {
					res.redirect('/stocks');
				}
			});
		});
	});
});

module.exports = router;
