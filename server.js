var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var startApp = require('./controllers/routes.js');

var app = express();
app.use(express.static('public'));
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

var databaseUri = "mongodb://localhost/cheerioNews";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect(databaseUri);
}
var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Mongoose error ' + err);
});
db.once('open', function() {
  console.log('Mongoose connection successful');
})
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

startApp(app);

app.listen(PORT, function() {
  console.log('App running on port ' + PORT);
});