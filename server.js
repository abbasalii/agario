// var PORT = process.env.PORT;
var PORT = 8080;

var mysql 	= require('mysql');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var rand = require('random-key');
var socket = require('socket.io');
var multipart = require('connect-multiparty');
var fs = require('fs');

var multipartMiddleware = multipart();
var app = express();

var pool 	=    mysql.createPool({
    connectionLimit : 4,
    host     : '104.209.43.4',//'localhost',//
    port 	 : 3306,
    user     : 'b3eb0d8169b0ed',//'root',//
    password : '6ae4ed82',//'lionking',//
    database : 'agario',
    debug    :  false
});

app.use(cookieParser());
app.use(session({secret: rand.generate(64)}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('img'));
app.use(express.static('html'));


app.get('/',function(req, res){
	res.sendFile(__dirname +'/html/map.html');
});

app.post('/signup',function(req,res){

	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var user = req.body.loginid;
	var pass = req.body.password;


	pool.getConnection(function(err,connection){

		if (err) {
			console.log("Failed to connect to the database");
			res.json({"code":500});
			return;
		}

		connection.query('SELECT * FROM CREDENTIAL WHERE USER_NAME=?', [user],
			function(err,rows,fields) {
				if(err){
					// console.log("Failed to fetch users");
					connection.release();
					res.json({"code":501});
				}
				else if(rows.length>0){
					connection.release();
					res.json({"code":502});
				}
				else{
					connection.query('INSERT INTO USER (FIRST_NAME,LAST_NAME) VALUES (?,?)',[fname,lname],
						function(err,rows,fields){

							if(err){
								connection.release();
								console.log(err);
								res.json({"code":550});
							}
							else{
								connection.query('INSERT INTO CREDENTIAL (U_ID,USER_NAME,PASSWORD) VALUES (?,?,?)',
									[rows.insertId, user, pass],
									function(err,rows,fields){

										connection.release();
										if(err){
											console.log(err);
											res.json({"code":550});
										}
										else{
											res.json({"code":200});
										}
									}
								);
							}
						}
					);
				}
			}

		);
	});
});

app.post('/signin',function(req,res){

	var user = req.body.loginid;
	var pass = req.body.password;


	pool.getConnection(function(err,connection){

		if (err) {
			console.log("Failed to connect to the database");
			res.json({"code":500});
			return;
		}

		connection.query('SELECT * FROM CREDENTIAL WHERE USER_NAME=? && PASSWORD=?', [user,pass],
			function(err,rows,fields) {

				connection.release();
				if(err){
					res.json({"code":501});
				}
				else if(rows.length==0){

					res.json({"code":505});
				}
				else{
					
					res.json({"code":200});
				}
			}

		);
	});
});

app.post('/fblogin',function(req,res){

	var fb = req.body.fbid;
	var fname = req.body.firstname;
	var lname = req.body.lastname;

	pool.getConnection(function(err,connection){

		if (err) {
			console.log("Failed to connect to the database");
			res.json({"code":500});
			return;
		}

		connection.query('SELECT * FROM FACEBOOK WHERE FB_ID=?', [fb],
			function(err,rows,fields) {

				if(err){
					res.json({"code":501});
					connection.release();
				}
				else if(rows.length==0){

					connection.query('INSERT INTO USER (FIRST_NAME,LAST_NAME) VALUES (?,?)',
						[fname,lname],
						function(err,rows,fields){

							if(err){
								res.json({"code":501});
								connection.release();
							}
							else{
								connection.query('INSERT INTO FACEBOOK(U_ID,FB_ID) VALUE(?,?)',
									[rows.insertId, fb],
									function(err,rows,fields){

										connection.release();
										if(err){
											res.json({"code":501});
										}
										else{
											res.json({"code":210});
										}
									}
								);
							}
						}
					);
				}
				else{
					
					res.json({"code":200});
				}
			}

		);
	});
});

app.get('/logout',function(req, res){

	delete req.session.login;
	res.redirect('/login');
});

var server = app.listen(PORT);
var io = socket.listen(server);

io.sockets.on('connection', function (sock) {

	console.log("connection established");
	// socket.on(,function(){
	// 	console.log('Client has requested for stock information');
	// 	getStock(socket);
	// });
});