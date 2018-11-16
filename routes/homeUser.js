var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var creds = require('../app');

var userid;

router.get('/', function(req, res, next) {
	if(req.session.user == 1) {
		userid = req.session.id;
		var con = mysql.createConnection({
			host: 'localhost',
			user: creds.creds[0].username,
			password: creds.creds[0].password,
			database: 'portfolio'
		});
		var miscAmt, reAmt, mfAmt, stockAmt;
		con.connect(function(err) {
			if(err) throw err;
			var sql = 'SELECT SUM(amount) as sum FROM misc_exp WHERE uid = ' + userid;
			con.query(sql, function(err, result) {
				if(err) throw err;
				miscAmt = result[0].sum;
				if(miscAmt==undefined)miscAmt=0;
				console.log(miscAmt);
				var sql1 = 'SELECT SUM(price*area) as sum FROM real_estate WHERE uid = ' + userid;
				con.query(sql1, function(err, result) {
					if(err) throw err;
					reAmt = result[0].sum;
					if(reAmt==undefined)reAmt=0;
					var sql2 = 'SELECT SUM(principal) as sum FROM mutual_fund WHERE uid = ' + userid;
					con.query(sql2, function(err, result) {
						if(err) throw err;
						mfAmt = result[0].sum;
						if(mfAmt==undefined)mfAmt=0;
						var sql3 = 'SELECT SUM(curr_price*no_stocks) as sum FROM stock WHERE uid = ' + userid;
						con.query(sql3, function(err, result) {
							if(err) throw err;
							stockAmt = result[0].sum;
							if(stockAmt==undefined)stockAmt=0;
							console.log(miscAmt);
							var totsum = mfAmt+stockAmt+reAmt+miscAmt;
							var colr;
							if(mfAmt>=(stockAmt+reAmt+miscAmt))  colr="#5cb85c";
							else if(mfAmt+miscAmt>=(stockAmt+reAmt)) colr="#f0ad4e";
							else colr="#d9534f";
							res.render('homeUser', {title: 'User\'s Home', uid: userid, totsum: totsum, sa: stockAmt, ra: reAmt, ma: miscAmt, fa: mfAmt, colr: colr});
						});
					});
				});
				// var vdata = [];
				// for(i = 0; i < result.length; i++) {
				// 	var ob = new Object();
				// 	ob["name"] = result[i].name;
				// 	ob["desc"] = result[i].description;
				// 	ob["amt"] = result[i].amount;
				// 	ob["bdate"] = result[i].buying_date;
				//
				// 	vdata.push(ob);
				// }
				// res.render('homeUser', {title: 'User\'s Home', uid: userid, vdata: vdata });
			});

		});
	} else {
		res.redirect('/login');
	}
});

router.post('/', function(req, res, next) {
	var con = mysql.createConnection({
		host: 'localhost',
		user: creds.creds[0].username,
		password: creds.creds[0].password,
		database: 'VEHICLE_RENTAL'
	});

	con.connect(function(err) {
		if(err) throw err;
		console.log('Connected to PROJECT database');
		var toSend;

		if(req.body.car=='Cars') {
			toSend = 'car';
		} else {
			toSend = 'bike';
		}
		var sql = "Select Plate_No,v.Model_Name as Model,Company,Type,V_Type,Seats,Units,Color,G_ID, Cost from Vehicles v, VehicleDetails vd where Booked=0 and v.Model_Name=vd.Model_Name and V_type='"+toSend+"';";
		console.log(sql);
		con.query(sql, function(err, result) {
			if(err) throw err;
			var vehicleData = [];
			for(i=0;i<result.length;++i) {
				var elem = new Object();
				elem["plno"] = result[i].Plate_No;
				elem["model"] = result[i].Model;
				elem["company"]= result[i].Company;
				elem["type"]= result[i].Type;
				elem["vcltype"]= result[i].V_Type;
				elem["seats"]= result[i].Seats;
				elem["qty"]= result[i].Units;
				elem["color"]= result[i].Color;
				elem["gid"]= result[i].G_ID;
				elem["cost"]= result[i].Cost;
				vehicleData.push(elem);
				//console.log(result[i]);
			}
			// vehicleData.forEach(function(entry) {
			//     console.log(entry.plno);
			// });
			res.render('homeUser', {title: 'User\'s Home', uid: userid, vdata: vehicleData, goto: 1});

		});
	});
});

module.exports = router;
