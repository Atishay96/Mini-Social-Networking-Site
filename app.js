var express = require('express');
var session = require('express-session');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var home = require('./routes/home');
var another = require('./routes/another');
var psi = require('./routes/psi');
var multer = require('multer');
var account = require('./routes/account');
var wrong = require('./routes/wrong');
mongoose.connect('mongodb://localhost/registration');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:')); 

var app = express();

app.use(session({
  secret: 'hakuna matata',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

db.once('open',function(){
	console.log("DataBase Connected");
});

var UserSchema = mongoose.Schema ({
	Name: String,
	Email: String,
	Address: String,
	Phone: String,
	Password: String,
	Path: String,
	Likes: String,
	Website: String,
	Bio: String
});

UserSchema.methods.status = function(){
	var status ="Ok";
	console.log("Status: " + status);
};

var LikeProfileSchema = mongoose.Schema({
	User1: String,
	User2: String
});

var ModelPS = mongoose.model('Plikes', LikeProfileSchema , 'Plikes');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,'./public/dp/')
    },
    filename: function(req,file,cb){
      cb(null,Date.now() + '-' + file.originalname );
    }
});

var upload = multer({ storage:storage  });

var Modelo = mongoose.model('registrations', UserSchema, 'registrations');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/home', home);
app.use('/wrong',wrong);
app.use('/psi',psi);
app.use('/account',account);
// app.use('/another',another);


var CommentSchema = mongoose.Schema({
	User1 : String,
	Data: String,
	User2: String,
	Type: String, //0 is for comment 1 is for confession
	Time: String
});

var ModelCom = mongoose.model('CAC', CommentSchema, 'CAC');


app.post('/comment',function(req,res){
	var user1;
	var user2_si = open_id;
	var user2;
	Modelo.find({'Email': sess.user},function(err,docs){
		if(err) return console.error(err);
		console.log(docs);
		console.log("hello");
		user1 = docs[0]._id;
		console.log(user1);
	});
	Modelo.find({},function(err,docs){
		if(err) return console.error(err);

		user2 = docs[user2_si]._id;
		console.log(user2);
	});
	setTimeout(function(){
		console.log(user1);
		console.log(user2);
		console.log('end');
		var comment_entry = new ModelCom({'User1': user1, 'Data': req.body.data, 'User2': user2, 'Type': '0', 'Time': Date.now()})
		comment_entry.save(function(err){
			if(err) return console.error(err);
		});
	},1000);
});
app.post('/get_dp_like_name',function(req,res,next){
	 ModelPS.find({'User2': docs123._id},function(err,data){
	 	if(err) return console.error(err);
	 	console.log(data);
	    res.send(data);
	 });
});

//check whether the user profile is liked by the person who is logged in
app.post('/likeorunlike',function(req,res,next){
	Modelo.find({'Email':sess.user},function(err,data1){
		if(err) return console.error(err);
		console.log(data1[0]._id);
		ModelPS.find({'User1': data1[0]._id,'User2': docs123._id},function(err,data){
	 		if(err) return console.error(err);
	 	
	 		console.log(data);
	    	res.send(data);
	 });
	});
});

app.post('/hey_jude',function(req,res,next){
	console.log("yo");
	console.log(req.body.data);
	Modelo.find({'_id':req.body.data},function(err,data1){
		if(err) return console.error(err);

		console.log(data1);
		res.send(data1);
	})
});	

//total likes
app.post('/totall',function(req,res,next){
	console.log("Who am i?");
	console.log(docs123._id);
	ModelPS.find({'User2': docs123._id},function(err,data){
		if(err) return console.error(err);
		console.log(data);
		console.log(data.length);
		res.send(data);
	})
});

app.post('/get_sess_id',function(req,res,next){
	res.send(sess.user);
});

app.post('/get_open_id',function(req,res,next){
	res.send(docs123.Email);
});


app.post('/confession',function(req,res){
	var user2_si = open_id;
	var user2;
	Modelo.find({},function(err,docs){
		if(err) return console.error(err);

		user2 = docs[user2_si]._id;
		console.log(user2);
	});
	setTimeout(function(){
		console.log(user2);
		console.log('end');
		var comment_entry = new ModelCom({'User1': '-1', 'Data': req.body.data, 'User2': user2, 'Type': '1', 'Time': Date.now()})
		comment_entry.save(function(err){
			if(err) return console.error(err);
		});	
	},1000);
	
});

app.post('/getcom',function(req,res){
	console.log("what do you mean?");
	// console.log(docs123._id);
	ModelCom.find({'User2': docs123._id},function(err,data){
		if(err) return console.error(err);
		res.send(data);	
	});
});
// get user profile comments
app.post('/getusercomment',function(req,res,next){
	Modelo.find({'Email': sess.user},function(err,documents){
		if(err) return console.error(err);
		ModelCom.find({'User2': documents[0]._id},function(err,data){
			res.send(data);
		});	
	});
});

//check if like is present there user1 likes user2 profile picture

app.post('/check_like',function(req,res,next){
	Modelo.find({'Email': sess.user},function(err,documents){
			if (err) return console.error(err);
			console.log(documents);
			ModelPS.find({'User1':documents[0]._id,'User2':docs123._id},function(err,documents1){
				if(err) return console.error(err);
				
				var liko = new ModelPS({'User1':documents[0]._id,'User2':docs123._id});
				console.log(documents1.length);
				if(documents1.length == 0)
				{
					liko.save(function(err){
						if(err) return console.error(err);
						console.log("Eureka");
						});
				}
				else
				{
					console.log('deleted');
					ModelPS.find({'User1':documents[0]._id,'User2':docs123._id}).remove().exec();
				}
			});
		});
});

var sess;




app.post('/login',function(req,res){
	sess= req.session;
	Modelo.find({'Email': req.body.email ,'Password': req.body.password},function(err,docs){
		if(err) return console.error(err);
		var len = docs.length;
		console.log(len);

		if(len == 1)
		{
			console.log("Logged In");
			sess.user = req.body.email;
			sess.uniqueid = docs[0].id;
			console.log(sess.user);
			console.log(sess.id);
			return res.redirect('/home');
		}
		else
		{
			return res.redirect('/wrong');
			console.log("Wrong Password");
		}
	});
});

app.post('/acc',function(req,res){
	
	Modelo.find({'Email': sess.user},function(err,docs){
		if(err) return console.error(err);		
		console.log(sess.user);
		console.log(docs);
		res.send(docs);
	});
});


app.post('/signup',function(req,res){
	var path = "/dp/default.jpg"
	console.log("Signing Up");
	var user = new Modelo({'Name': req.body.name, 'Email': req.body.email, 'Address': req.body.address , 'Phone': req.body.phone, 'Password': req.body.password, 'Path': path, 'Likes': 0})
	user.save(function(err,user){
		if(err) return console.error(err);

		user.status();
	});
	res.redirect('/');
});

app.post('/update_dp',upload.single('file'),function(req,res){
	console.log(sess.user);
	Modelo.find({'Email':sess.user},function(err,docs){
		if(err) return console.error(err);
		console.log(req.file);
		console.log(docs);
		console.log(docs[0].Path);	
		docs[0].Path = "/dp/" + req.file.filename;
		console.log(docs[0].Path);
		 docs[0].save();
		console.log("updated:"+ docs);
	});
	
	return res.redirect('/account');

	res.send(req.file);
});


//get all comments for home page
app.post('/getallcomments',function(req,res,next){
	ModelCom.find({},function(err,docs){
		if(err) return console.error(err);
		res.send(docs);
	});
});
//getuserdata
app.post('/getuserdata',function(req,res){
	Modelo.find({},function(err,docs){
		if(err) return console.error(err);	
		res.send(docs);		
	})
});

app.get('/logout',function(req,res){
	console.log(sess.user);
	req.session.destroy();
	sess.user = null;
	res.redirect('/');
});

app.post('/getusers',function(req,res){
	console.log("working");
	var id = sess.user;
	Modelo.find({},function(err,docs){
		if(err) return console.error(err);
		res.send(docs);
	});
});
var docs123;
var open_id;

app.post('/update_website',function(req,res,next){
	Modelo.find({'Email':sess.user},function(err,docs){
		if(err) return console.error(err);
		docs[0].Website = req.body.value;
		docs[0].save();
	});
});
app.post('/update_bio',function(req,res,next){
	Modelo.find({'Email':sess.user},function(err,docs){
		if(err) return console.error(err);
		docs[0].Bio = req.body.value;
		docs[0].save();
	});
});


app.get('/openprofile/:id',function(req,res){
	console.log("huehuehue");
	console.log(req.params.id);
	open_id = req.params.id;
	Modelo.find({},function(err,docs){
		if(docs[req.params.id].Email==sess.user)
		{
			res.redirect('/account');
		}
		else
		{
			res.redirect('/another');
		}
		docs123 = docs[req.params.id];		
	});
});

app.get('/another',function(req,res,next){
			console.log('it\'s working');
			res.render('./another',{'docs': docs123});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});	

app.use(function(req, res, next) {
    if (req.session.user == null)
    {
		// if user is not logged-in redirect back to login page //
        res.redirect('/');
    } 
    else
    {
        next();
    }
});
// error handler


module.exports = app;
