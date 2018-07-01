var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var startApp = require('./controllers/routes.js');

var PORT = 8080;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect("mongodb://localhost/cheerioNews");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

startApp(app);

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});