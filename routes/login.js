var express = require('express');
var router = express.Router();

var AM = require('../modules/account-manager');

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.cookies.user == undefined || req.cookies.pass == undefined){
    res.render('login/login', { title: 'Login' });
  } else {
    console.log('Cookie is set !!!');
  }
});

router.post('/',function(req,res,next){
  console.log(req.body['user'], 'Username');
  console.log(req.body['pass'],'Password');
  AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
        console.log('Login Success for User : '+o.user);
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				// res.status(200).send(o);
        res.format({
          html: function(){
              res.render('blobs/showUser', {
                "user" : o
              });
          },
          json: function(){
              res.json(user);
          }
        });

			}
		});
});

module.exports = router;
