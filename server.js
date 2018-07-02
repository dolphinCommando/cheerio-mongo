var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var startApp = require('./controllers/routes.js');

var app = express();
app.use(express.static('public'));
var PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/cheerioNews");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

startApp(app);

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});