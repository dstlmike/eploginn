/*
var express = require('express');
var router = express.Router();
var app = express();
var routes3 = express();
var routes = express();
var bodyParser = require('body-parser');
var axios = require('axios');
var ejs = require('ejs');
var path = require('path');
var nodemailer = require('nodemailer');
var moment = require('moment');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var bcrypt = require('bcrypt');
var multer = require('multer');
var imggSchema = require('../middleware/model.js');
var imgSchema = require('../middleware/model.js');
var date = moment().utcOffset(-240).format('LL');
var time = moment().utcOffset(-240).format('LTS');
var year = moment().utcOffset(-240).format('YYYY');
var month = moment().utcOffset(-240).format('MM');
var day = moment().utcOffset(-240).format('DD');
//var getIpData = require('../modules/ipdata.js');
var getAllDocuments = require('../middleware/dbep.js');

routes3.set('trust proxy', true);
routes3.use(express.static('partials'));
routes3.set('view engine', 'ejs');
routes3.set('views', 'views');
routes3.use(bodyParser.json());
routes3.use(bodyParser.urlencoded({
   extended: true
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(async function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  User.findById(id, async function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  async function (username, password, done) {
    User.findOne({
      email: username
    }, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false, { message: 'User not found!' });
      bcrypt.compare(password, user.password, async function(err, res) {
        if (err) return done(err)
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password!' });
        }
      })
    })
  }
));

async function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('error', 'You needed to be logged in to visit that page!');
    res.redirect('/login')
  }
}

var MongoDBStore = require('connect-mongodb-session')(session);

const mongoString = process.env.MONGO_DB_S || 'mongodb://dstlmike1:308boonave@ac-oc5e8f9-shard-00-00.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-01.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-02.dv4owuj.mongodb.net:27017/passport?ssl=true&replicaSet=atlas-526m7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

//const mongoString = 'mongodb://dstlmike1:308boonave@ac-oc5e8f9-shard-00-00.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-01.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-02.dv4owuj.mongodb.net:27017/passport?ssl=true&replicaSet=atlas-526m7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

var store = new MongoDBStore({
  uri: mongoString,
  collection: 'mySessions'
});

/* ************ * -------- /
routes3.use(express.static(__dirname + '/public'));
routes3.set('view-engine', 'ejs')
routes3.use(express.urlencoded({ extended: false }))
routes3.use(flash())
routes3.use(session({
  secret: 'SECRET_KEY_STRING',
  cookie: {
    maxAge: 1000 * 60 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));
routes3.use(passport.initialize());
routes3.use(passport.session());

const mongoose = require('mongoose');
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;






const userSchema = new Schema({
  email: String,
  password: String
});

//const User = mongoose.model('users', userSchema);

routes3.post('/register', async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  })

  if (user) {
    req.flash('error', 'Sorry, that name is taken. Maybe you need to <a href="/login">login</a>?');
    res.redirect('/register');
  } else if (req.body.email == "" || req.body.password == "") {
    req.flash('error', 'Please fill out all the fields.');
    res.redirect('/register');
  } else {
    bcrypt.genSalt(10, async function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        if (err) return next(err);
        new User({
          email: req.body.email,
          password: hash
        }).save()
        req.flash('info', 'Account made, please log in...');
        res.redirect('/login');
      });
    });
  }
});

routes3.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }))

routes3.get('/', loggedIn, (req, res) => {
  res.render('index.ejs', { email: req.user.email })
})

routes3.get('/login', (req, res) => {
console.log(req.body);
  res.render('login.ejs')
})

routes3.get('/register', (req, res) => {
  res.render('register.ejs')
})

routes3.get('/logout', (req, res) => {
req.logout(async function(err) {
    if (err) {
      return next(err); // Handle errors
    }
console.log(req);
    res.redirect('/'); // Redirect after logout is complete
  });
//console.log(req);
 // req.logOut()
//console.log(req);
//  res.redirect('/login')
})

/*
app.listen(process.env.PORT, async function(req, res, next) {
console.log('Connected');
});        // || 3000, process.env.IP || '0.0.0.0');
*/
//app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');


/////module.exports = routes3;

















/*

app.get('/', async function(req, res, next) {
var date = moment().utcOffset(-240).format('LL');
var time = moment().utcOffset(-240).format('LTS');
//var ippp = req.socket.remoteAddress
  var ippp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var ipp = ippp.split(',')[0].trim();
  var reqUrl = req.path;
  var ipdata = await getIpData(ipp);
  var { ip, city, country_name, postal } = ipdata;
  var { name, domain } = ipdata.asn;
  var { is_threat, is_anonymous, is_known_attacker, is_known_abuser } = ipdata.threat;

getAllDocuments(ipp, reqUrl);
var logg = date + ' ' + time + '\n' + ipp + '\n' + req.protocol + '://' + req.hostname + '\n' + req.url + '\n' + 'Location: {' + '\n' + 'City: ' + city + ', \n' + 'Contry: ' + country_name + ', \n' + 'Postal: ' + postal + ', \n' + '},' + '\n' + 'Asn: {' + '\n' + 'Name: ' + name + ', \n' + 'Domain: ' + domain + '\n' + '}';

  console.log(logg + '\n' + ipp);
  res.render('canonical.ejs');
});
*/
