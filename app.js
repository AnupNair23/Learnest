var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var JWT = require('jwt-simple');
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');
var AWS = require('aws-sdk');


// const config = require('./config/appConfig');
// const apiSecret = config.secret;




// app.use('/api', expressJwt({
//     secret: apiSecret
// }));

function parallel(middlewares) {
    return function (req, res, next) {
        async.each(middlewares, function (mw, cb) {
            mw(req, res, cb);
        }, next);
    };
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized');
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


//=======================================================HTML Pages=====================================================

app.get('/Reg', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

//=======================================================Models============================================================================

//Logs
//var log = require('./routs/log/log');
var User = require('./models/admin');


// ============================================ API END POINTS ===========================================


app.post("/login", User.login);
app.post('/signUp', User.signUp);




//======================================================Connect to Mongoose================================================================

var promise = mongoose.connect('mongodb://anupnair:lebronjames@ds131914.mlab.com:31914/learnest', {
    useMongoClient: true,
    /* other options */
    
});

//=====================================================API End points======================================================================



const PORT = process.env.PORT || 4050;
app.listen(PORT);
console.log("Server connected to port" + " " + PORT);