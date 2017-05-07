var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
//var moment 		= require('moment');

/*
	ESTABLISH DATABASE CONNECTION
*/

var dbName = process.env.DB_NAME || 'node-login';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		console.log(e);
	} else {
		if (process.env.NODE_ENV == 'live') {
			db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
				if (e) {
					console.log('mongo :: error: not authenticated', e);
				}
				else {
					console.log('mongo :: authenticated and connected to database :: "'+dbName+'"');
				}
			});
		}	else{
			console.log('mongo :: connected to database :: "'+dbName+'"');
		}
	}
});
var accounts = db.collection('accounts');

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

exports.manualLogin = function(user, pass, callback)
{
  console.log('Inside manualLogin username: '+user+"password: "+pass);
	accounts.findOne({user:user}, function(e, o) {
    console.log("Inside findone");
    console.log(o);
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

var validatePassword = function(plainPass, hashedPass, callback)
{
  console.log(plainPass,'Inside Valid Password Method');
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);

  console.log(plainPass,'plainPass');
	console.log(validHash,'validHash');
	console.log(hashedPass,'hashedPass');

	callback(null, hashedPass === validHash);
}
