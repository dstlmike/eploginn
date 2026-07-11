var express = require('express');
var imgg = express();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var imggSchema = require('./model.js');
var multer = require('multer');
var path = require('path');
imgg.set('trust proxy', true);

imgg.set('view engine', 'ejs');
imgg.set('views', 'views');
//app.use(express.static(path.join(__dirname, 'partials')));
imgg.use(bodyParser.json());
imgg.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(path.join(__dirname, 'views')));
//var connection_string = "mongodb://dstlmike1:308boonave@ac-oc5e8f9-shard-00-00.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-01.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-02.dv4owuj.mongodb.net:27017/image-upload?ssl=true&replicaSet=atlas-526m7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
// MongoDB connection
//mongoose.connect(connection_string)
  //  .then(() => console.log("DB Connected"))
  //  .catch(err => console.log(err));

// Middleware
imgg.use(bodyParser.urlencoded({ extended: false }));
imgg.use(bodyParser.json());

// Multer setup for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to render image upload page and display images
imgg.get('/img', (req, res) => {
    imggSchema.find({})
        .then(data => {
            res.render('home.ejs', { items: data });
        })
        .catch(err => console.log(err));
});

imgg.post('/img', upload.single('image'), (req, res, next) => {
    const obj = {
		address: req.body.description,

        img: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
						description: req.body.description
        }
    };
    imggSchema.create(obj)
        .then(item => {
            res.redirect('/img');
        })
        .catch(err => console.log(err));
});

module.exports = imgg;
/*
app.get('/home', (req, res) => {
    imgSchema.find({})
        .then(data => {
            res.render('imagepage.ejs', { items: data });
        })
        .catch(err => console.log(err));
});

app.post('/home', upload.single('image'), (req, res, next) => {
    const obj = {
		address: req.body.description,

        img: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
						description: req.body.description
        }
    };
    imgSchema.create(obj)
        .then(item => {
            res.redirect('/home');
        })
        .catch(err => console.log(err));
});
// Route to handle image upload
*/
