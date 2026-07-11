const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var routes = require('./routes/routes.js');
var routes3 = require('./routes/routes3.js');

var port = Number(process.env.NODEJS_SERVICE_PORT || process.env.PORT || 3002);
//LocalStrategy = require('passport-local').Strategy;
const mongoString = process.env.MONGO_DB_S || 'mongodb://dstlmike1:308boonave@ac-oc5e8f9-shard-00-00.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-01.dv4owuj.mongodb.net:27017,ac-oc5e8f9-shard-00-02.dv4owuj.mongodb.net:27017/passport?ssl=true&replicaSet=atlas-526m7w-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';


var MongoDBStore = require('connect-mongodb-session')(session);



/* ************ */
app.use(express.static(__dirname + '/public'));
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))



app.use(routes);
// --------- app.use(routes3);

app.listen(port, function(error) {
  if(error) {
    console.log(error);
  }
  console.log('Server started and running on Port: ' + port);
});
