var express = require('express');
var router = express.Router();
var app = express();
const Website = require('../middleware/url.js');
const Company = require('../middleware/url.js');

var routes = express();
var bodyParser = require('body-parser');
var axios = require('axios');
var ejs = require('ejs');
var path = require('path');
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');
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
var guesss = moment.tz.guess(true); // Europe/Berlin

//var getIpData = require('../modules/ipdata.js');
var getAllDocuments = require('../middleware/dbep.js');
var profileAllDocuments = require('../middleware/profilefind.js');
var { getMyData } = require('../middleware/async.js');
app.set('trust proxy', true);
app.use(express.static('partials'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
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

/* ************ */
app.use(express.static(__dirname + '/public'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'SECRET_KEY_STRING',
  cookie: {
    maxAge: 1000 * 60 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;






const userSchema = new Schema({
  email: String,
  password: String
});

const User = mongoose.model('users', userSchema);

app.post('/register', async (req, res, next) => {
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

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }))

app.get('/', loggedIn, (req, res) => {
   
  res.render('index.ejs', { email: req.user.email })
})








//const express = require('express');
//const router = express.Router();
const Post = require('../middleware/Post.js');

// The route captures the URL field (slug)
router.get('/posts/:slug', async (req, res) => {
  try {
    // Find the document matching the URL slug
    const post = await Post.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).send('Post not found');
    }
    
    res.render('index.ejs', { post });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//module.exports = router;




app.get('/url', loggedIn, (req, res) => {
  var name = "req.body.name";
  res.render('url.ejs') // { items: data })
  //res.send(name);
  //res.render('index.ejs', { email: req.user.email })
})


app.post('/add-site', loggedIn, async (req, res) => {
  try {
    const newSite = new Website({
      name: req.body.name,
      url: req.body.url
    });

    await newSite.save();
    res.status(201).json(newSite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



app.get('/redirect/:id', loggedIn, async (req, res) => {
  const doc = await Company.findOne({"url": "/redirect/" + req.params['id']});
console.log('This ' + req.params['id']);
   try {
        // 1. Find the document by its ID
        const doc = await Company.findOne({"url": "/redirect/" + req.params['id']});
console.log(req.params['id']);
        if (doc && doc.url) {
            // 2. Assign the URL field to a variable
            const targetUrl = doc.url;
console.log(targetUrl);
            // 3. Use it (e.g., redirect the user)
           // return res.redirect('/url');
           return res.render('url.ejs')
        } else {
       //    const targetUrl = "/redirect" + doc.url;
//console.log(targetUrl);
            return res.status(404).send('URL not found');
        }
    } catch (err) {
    //   console.log(doc);
      // console.log(targetUrl);
        res.status(500).send('Server Error');
    }
});



app.get('/hi', loggedIn, (req, res) => {
  var name = "Alex";
  getAllDocuments(name);
  res.render('profile.ejs') // { items: data })
  //res.send(name);
  //res.render('index.ejs', { email: req.user.email })
})

app.get('/id', loggedIn, async function(req, res, next) {
  var name = req.body.Name;
  var address = req.body.address;
  var phone = req.body.phone;
  var data;
  var matchHash = { iname: name, address: address, phone: phone };
  profileAllDocuments(matchHash)

  .then(data => {
    res.render('profile.ejs', { items: data, name: req.body.name, address: req.body.address, phone: req.body.phone })

  })
  .catch(err => console.log(err));

  //res.render('profile.ejs', { items: data, name: req.body.name, address: req.body.address, phone: req.body.phone })
  //res.render('index.ejs', { email: req.user.email })
})

app.post('/id', loggedIn, async function(req, res) {
  var name = req.body.Name;
  var address = req.body.address;
  var phone = req.body.phone;
  var data;
  var matchHash = { items: data, name: name, address: address, phone: phone };
  profileAllDocuments(matchHash)

    .then(data => {
      res.render('profile.ejs', { items: data, name: req.body.name, address: req.body.address, phone: req.body.phone })

    })
    .catch(err => console.log(err));
  //res.render('index.ejs', { email: req.user.email })
})

app.get('/imggnot', loggedIn, async function(req, res) {
//  const existingDoc = await imggSchema.findOne({"address":"none"});
//  for (var i = 1; i < 5; i++) {
  //  console.log(i);
//  }
  imggSchema.find({})
      .then(data => {
          res.render('home1.ejs', { items: data })
      })
      .catch(err => console.log(err));
})

app.post('/imggnot', loggedIn, upload.single('image'), async function(req, res, next) {
var appp = imggSchema.findOne({"address": req.body.description})
///const existingDoc = await imggSchema.findOne({"address":req.body.description});

///for (var i = 1; i < 2; i++) {
//for (var i = 1; i < 5; i++) {
///if (existingDoc == null || existingDoc.address == req.body.description) {
///  console.log("Document has beed added to database");


  const obj = {

  address: req.body.address,
      img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          description: req.body.description
      }

  };
    imggSchema.create(obj)

        .then(item => {
          res.redirect('/imggnot')

        })
//}
///} else {
 /// console.log("Document exists!");

   /// imggSchema.updateOne({"address": req.body.description}, {$push: {"addresss": {obj}}})

        .then(item => {
        ///  console.log(JSON.stringify(existingDoc.addresss[0].obj.address)); //, null, 2));
//}
          res.redirect('/imgg')

        })



      .catch(err => console.log(err));
 ///   }
///}
    })


app.get('/imggnott', loggedIn, async function(req, res) {
//  const existingDoc = await imggSchema.findOne({"address":"none"});
//  for (var i = 1; i < 5; i++) {
  //  console.log(i);
//  }
 //  var datee = moment.tz('America/Toronto').format('YYYYMMDD');
 //  console.log(datee);
  imggSchema.find({})
      .then(data => {
          res.render('home1tt.ejs', { items: data })
      })
      .catch(err => console.log(err));
})

app.post('/imggnott', loggedIn, upload.single('image'), async function(req, res, next) {
var appp = imggSchema.findOne({"address": req.body.description})
const existingDoc = await imggSchema.findOne({"address":req.body.address});
//var today = moment.tz('America/Toronto').format('YYYYMMDD');
   //console.log(today);
//for (var i = 1; i < 10; i++) {
//for (var i = 1; i < 5; i++) {
if (existingDoc == null || existingDoc.address != req.body.address) {
 console.log("Document has beed added to database");
//req.body.today = today;

  const obj = {

  address: req.body.address,
      today:{
        imgg:{
      img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          description: req.body.description
      }
        }
     }
  };
    imggSchema.create(obj)

        .then(item => {
          res.redirect('/imggnott')

        })
//}
} else if(existingDoc != null || existingDoc.address == req.body.address) {
  console.log("Document exists!");
  // today = today;
const obj = {

   address: req.body.address,
   today: {
   imgg: {
      img1: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          description: req.body.description
      }
   }
}
  };
    imggSchema.updateOne({"address": req.body.address}, {$set: { "today.imgg.img1": obj.today.imgg.img1 }}) 
        .then(item => {
      //    console.log(JSON.stringify(existingDoc.addresss[0].obj.address)); //, null, 2));
//}
          res.redirect('/imggnott')

        })



      .catch(err => console.log(err));
    //}
}
    })


app.get('/imggg', loggedIn, async function(req, res) {
  const existingDoc = await imggSchema.findOne({"address":"none"});
if (existingDoc) {
  console.log(JSON.stringify(existingDoc.address)); //, null, 2));
} else {
  console.log("Document does not exist!");
}
/*
async function getDocumentsAsArray(imggSchema) {
  try {
    const collection = imggSchema.collection('images');

    // The find() method returns a cursor
    const cursor = collection.find({});

    // Use toArray() to get all documents as an array
    const allDocs = await cursor.toArray();

    console.log(allDocs);
    return allDocs;

  } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }
*/


  imggSchema.find({})
      .then(data => {
          res.render('home1.ejs', { items: data })
      })
      .catch(err => console.log(err));
  //res.render('index.ejs', { email: req.user.email })
})

app.post('/imggg', loggedIn, upload.single('image'), async function(req, res, next) {
var appp = imggSchema.findOne({"address": req.body.description})
const existingDoc = await imggSchema.findOne({"address":req.body.description});

const obj = {
address: req.body.description,
//addresss: req.body.description,
    img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        description: req.body.description
    }
};

if (existingDoc.address == req.body.description) {
console.log("Document exists!");

  imggSchema.updateOne({"address": req.body.description}, {$push: {"addresss": {obj}}})

      .then(item => {
        console.log(appp);
        res.redirect('/imggg')
      })

} else {
console.log("Document had beed added to database");
  imggSchema.create(obj)
      .then(item => {
        res.redirect('/imggg')
      })
      .catch(err => console.log(err));
    }
    })

    app.get('/imgggg', loggedIn, async function(req, res) {
      const existingDoc = await imggSchema.findOne({"address":"none"});
    if (existingDoc) {
      console.log(JSON.stringify(existingDoc.address)); //, null, 2));
    } else {
      console.log("Document does not exist!");
    }


      imggSchema.find({})
          .then(data => {
              res.render('home2.ejs', { items: data })
          })
          .catch(err => console.log(err));
    })

    app.post('/imgggg', loggedIn, upload.single('image'), async function(req, res, next) {
    var appp = imggSchema.findOne({"address": req.body.description})
    const existingDoc = await imggSchema.findOne({"address":req.body.description});

    const obj = {
    address: req.body.description,
        img: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            description: req.body.description
        }
    };

    if (!existingDoc || existingDoc.address != req.body.description) {
      console.log("Document had beed added to database");
        imggSchema.create(obj)
            .then(item => {
              res.redirect('/imgggg')
            })

    } else {
      console.log("Document exists!");

        imggSchema.updateOne({"address": req.body.description}, {$push: {"addresss": {obj}}})

            .then(item => {
              console.log(JSON.stringify(existingDoc.addresss[0].obj.address)); //, null, 2));

              res.redirect('/imgggg')
            })



          .catch(err => console.log(err));
        }
        })









app.get('/imggyes', loggedIn, (req, res) => {
 imggSchema.find({})
      .then(data => {
         var guesss = moment.tz.guess(true); // Europe/Berlin

   console.log(guesss);
 
          res.render('home.ejs', { items: data })
      })
      .catch(err => console.log(err));
//  res.render('index.ejs', { email: req.user.email })
})

app.post('/imggyes', loggedIn, upload.single('image'), (req, res, next) => {
var appp = imggSchema.findOne({"address": req.body.description})

const obj = {
address: req.body.description,
//addresss: req.body.description,
    img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        description: req.body.description
    }
};

if(appp > 1) {


  imggSchema.updateOne({"address": req.body.description}, {$push: {"addresss": {obj}}})

      .then(item => {
        console.log(appp);
        res.redirect('/imggyes')
      })

} else {

  /*
  const obj = {
  address: req.body.description,

      img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          description: req.body.description
      }
  };
  */



  imggSchema.create(obj)
      .then(item => {
        res.redirect('/imggyes')
      })

      .catch(err => console.log(err));
    }
    })

app.get('/login', (req, res) => {
console.log(req.body);
  res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.get('/logout', (req, res) => {
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


app.get('/async', loggedIn, async (req, res, next) => { 
 var entry =  await getMyData();
 req.body = entry;
return res.send(entry)
   //render('index.ejs', { email: req.user.email })
})




app.get('/imggnottt', loggedIn, async function(req, res) {
//  const existingDoc = await imggSchema.findOne({"address":"none"});
//  for (var i = 1; i < 5; i++) {
  //  console.log(i);
//  }
   var datee = moment.tz('America/Toronto').format('YYYYMMDD');
   console.log(datee);
  imggSchema.find({})
      .then(data => {
          res.render('home1ttt.ejs', { items: data })
      })
      .catch(err => console.log(err));
})

app.post('/imggnottt', loggedIn, upload.single('image'), async function(req, res, next) {
//let img = "img";
   var appp = imggSchema.findOne({"address": req.body.description})
const existingDoc = await imggSchema.findOne({"address":req.body.address});
var datee = moment.tz('America/Toronto').format('YYYYMMDD');

   var today = moment.tz('America/Toronto').format('YYYYMMDDHHMMSS');


   
   console.log(datee);
for (var i = 1; i < 10; i++) {
//for (var i = 1; i < 5; i++) {
if (existingDoc == null || existingDoc.address != req.body.address) {
 console.log("Document has beed added to database");


  const obj = {

  address: req.body.address,
      img: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          description: req.body.description
      }

  };
    imggSchema.create(obj)

        .then(item => {
          res.redirect('/imggnottt')

        })
//}
} else if (existingDoc && existingDoc.img != null) {
 // obj.img == obj.img + i++);
   console.log("Document exists!");
const obj = {

   address: req.body.address,
      imgg: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          description: req.body.description
      }

  };
   //for (var i = 1; i < 10; i++) {

    imggSchema.updateOne({"address": req.body.address}, {$set: {[today]: obj.imgg}})
  // }
        .then(item => {
      //    console.log(JSON.stringify(existingDoc.addresss[0].obj.address)); //, null, 2));
//}
          res.redirect('/imggnottt')

        })



      .catch(err => console.log(err));
    }
}
    })





module.exports = app;

















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
