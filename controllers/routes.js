var scrape = require('./scrape');
var mongoose = require('mongoose');
var db = require('../models');

const startApp = function(app) {
  app.get('/', function(req, res) {
    scrape().then((success) => {
      console.log(success);
      db.Article.find().then((dbData) => {
        res.render('index', {article: dbData});
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });  
    }).catch(err => {
      console.log(err);
      res.sendStatus(502);
    });
  });

  app.post('/notes', function(req, res) {
    db.Article.find({_id: mongoose.Types.ObjectId(req.body.id)}).then((dbArticle) => {
      console.log('Article found');
      console.log(dbArticle);
      if (dbArticle[0].note !== null && dbArticle[0].note !== undefined) {
        console.log('note exists')
        //var noteIds = dbArticle.note.map(ref => {mongoose.Types.ObjectId(ref)});
        db.Note.find({_id: dbArticle[0].note}).then((dbData) => {
          console.log('Note found');
          console.log(dbData);
          res.send(dbData);
        });        
      }
      else {
        res.send({title: 'No Comments', body:'Nothing here'});
      } 
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.post('/notes/submit', function(req, res) {
    var newNote = req.body.comment;
    var id = req.body.id;
    db.Note.create(newNote).then((dbNote) => {
        res.send(dbNote);
        return db.Article.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$push: {note: dbNote._id}}, {new: true});
      }).then((dbArticle) => {
        console.log(dbArticle);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  });
}


module.exports = startApp;
