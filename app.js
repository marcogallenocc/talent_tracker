/*Talent Tracker */


//Express framework
var express = require ('express');
var app = express();


//Firebase 
//var firebase = require('firebase');
var admin = require('firebase-admin');

var serviceAccount = require('./talent-tracker-2fd83-firebase-adminsdk-dftd0-ebfef3013b.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://talent-tracker-2fd83.firebaseio.com/"
});

//Inicializamos la base de datos
var db = admin.database();
//admin.database.enableLogging(true)
//var ref = db.ref("/employees");


//Hanblebars
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    checkSelector: function (v1, v2, options) {

      if (v1 == v2) {

        return options.fn(this);
      } else {

        //return options.inverse(this);    
        return null;
      }

    }
  }
});

//Asignación de HB como engine de rendereo
app.engine('handlebars', handlebars.engine);

//View set 
app.set('view engine', 'handlebars');

//Midleware
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
	console.log(req.url);
	next();
});

app.get('/', function(req, res){
	res.render("login");
	//res.send("Index");
});

app.get('/login', function(req, res){
	res.send("login");
});

app.get('/logout', function(req, res){
	res.send("logout");
});

app.get('/create', function(req, res){
	/*var db = firebase.database();
	var ref = db.ref("employees");
	*/
	var ref = db.ref();

	var employee = ref.child('employees');

	var userKey = employee.push(
	{
		name:"Marco Antonio Gallen Vargas",
		position:"Lead Product Manager"
	});
	console.log(userKey.key);
	/*var usersRef = ref.child("users");
usersRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});*/
    
	
	res.send(userKey.key);
});

app.get('/edit/:id', function(req, res){

	var id = req.params.id;
	console.log(id);
	
	getUserById(id, res, "edit");

	
});

app.get('/view/:id', function(req, res){

	var id = req.params.id;
	//console.log(id);
	
	getUserById(id, res, "view");
	
	
});


app.get('/get_pdf/:id', function(req, res){
	res.send("Get PDF");
});

app.listen(3000, function(){
	console.log('Example app listening on port: 3000');
})



//Sync Helpers
function getUserById(id, res, viewToRender){
	var ref = db.ref();
	
	ref.child("employees").orderByKey().equalTo(id).once("value", function(snapshot) {
		//console.log(snapshot.val());
		console.log(viewToRender);
	  	//res.send(snapshot.val());
	  	var context = snapshot.val();
	  	res.render(viewToRender, context);
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
}