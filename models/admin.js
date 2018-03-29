var mongoose = require('mongoose');
var token;
// const config = require('./../../config/appConfig');
// const secret = config.secret;
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');



//User schema

var UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		index: true
	},
	emailId: {
		type: String,
		required: true,
		index: true
	},
	phone: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: String
	},
	DOB: {

		type: String
	}
});

//========================================= MODEL =======================================================

var UserProfile = module.exports = mongoose.model('users', UserSchema);





//============================================ USER LOGIN ==================================================

module.exports.login = function (req, res) {

	var emailId = req.body.emailId;
	var password = req.body.password;

	console.log("emailid", req.body.emailId);
	console.log("password", req.body.password);



	UserProfile.find({
		emailId: emailId
	}, function (err, result) {
		if (err) {
			res.send({
				"code": 400,
				"failed": "error ocurred"
			})
		}
		console.log("result==", result);

		if (result[0] != null) {

			if (result.length > 0) {

				if (result[0].password == password) {
					var string = JSON.stringify(result[0])
					var json = JSON.parse(string);


					var resultdata = {
						"emailId": result[0].emailId,
						"name": result[0].name
					};
					// if (resultdata) {
					// 	token = jwt.sign(resultdata, secret, {
					// 		expiresIn: 60 * 60 * 24 * 365 * 25
					// 	});
					// 	res.status(200).json({
					// 		"userName": result[0].name,

					// 		"token": token,
					// 		"userId": result[0].userId,


					// 	});
						console.log(result[0].emailId + " " + result[0].name + "  has successfully logged in with" + " " + result[0].emailId);
					//	console.log("Token=====  ", token);
			//		}




				} else if (result.emailId != emailId) {
					console.log("Wrong password");
					//res.send("WRONG_PASS");
					res.status(404).json({
						"code": 404,
						"message": "WRONG_PASS"
					});
				}
			}




		} else {

			console.log("Email does not exist");
			//res.send("NO_EMAIL");
			res.status(404).json({
				"code": 404,
				"message": "NO_EMAIL"
			});
		}
	})

}


//======================================= USER REGISTRATION ========================================



module.exports.signUp = function (req, res) {


	var today = new Date().getTime();


	var emailId = req.body.emailId;
	var User = "UserProfile";

	var formBody = new UserProfile({
		name: req.body.name,
		emailId: req.body.emailId,
		phone: req.body.phone,
		role: req.body.role,
		password: req.body.password,

		
	});
	var email = req.body.emailId;
	var mobNo = req.body.phone;


	console.log("req.body.emailId :", req.body.emailId);
	console.log("req.body.phone :", req.body.phone);
	console.log("req.body.Image :", req.body.Image);

	//Create new user
	UserProfile.create(formBody, function (err, userProfile) {
		console.log(" userProfile : ", userProfile);
		if (err) {
			console.log(" Error in creating User ", err.message);
			res.status(500).json({
				"error": err.message
			})
			return;
		}
		console.log(userProfile.name + " " + " created succesfully ");
		//		log.info(userProfile.username + " " + " created succesfully ");
		//res.json(userProfile);
		UserProfile.findOne({
			emailId: emailId
		}, function (err, form2) {
			if (err) {
				res.sendStatus(500);
				console.log(" Error in finding user ", err.message);
				return;
			}
			console.log("form2=========", form2);
			var string = JSON.stringify(form2)
			var json = JSON.parse(string);

			var resultdata = {
				"emailId": form2.emailId,
				"role": form2.userCategory
			};
			// var token = jwt.sign(resultdata, secret, {
			// 	expiresIn: 60 * 60 * 24 * 365 * 25
			// });
			// console.log("Signup token===", token);
			// res.status(200).json({
			// 	"name": form2.userName,
			// 	"emailId": form2.emailId,
			// 	"role": form2.userCategory,
			// 	"token": token,
			// 	"userId": form2._id,
			// 	"phone": form2.mobileNumber,
			// 	"password": form2.password

			// });
		});
	});
}




