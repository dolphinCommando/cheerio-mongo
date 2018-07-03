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
      if (dbArticle[0].note !== null && dbArticle[0].note !== undefined) {
        //console.log(dbArticle);
        //var noteIds = dbArticle.note.map(ref => {mongoose.Types.ObjectId(ref)});
        db.Note.find({_id: dbArticle[0].note}).then((dbData) => {
          console.log('Note found');
          console.log(dbData);
          res.send(dbData);
        });        
      }
      else {
        console.log('no notes');
        res.sendStatus(404);
      } 
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  });

  app.post('/notes/:id', function(req, res) {
    var newNote = req.body;
    var id = req.params.id;
    db.Note.create(newNote).then((dbNote) => {
      db.Article
      .findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$push: {note: dbNote._id}}, {new: true})
      .then((dbArticle) => {
        res.send(dbNote);
        console.log(dbArticle);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
    });
  });

  app.put('/notes/:id/:noteid', function(req, res) {
    var newNote = req.body;
    console.log('newNote ' + newNote);
    var noteId = req.params.noteid;
    var articleId = req.params.id;
    db.Note
      .update({_id: mongoose.Types.ObjectId(noteId)}, {$set: {title: newNote.title, body: newNote.body}})
      .then((dbNote) => {
        db.Article
          .find({_id: mongoose.Types.ObjectId(articleId)})
          .populate('note')
          .then((dbArticle) => {
            res.send(dbNote);
            console.log(dbArticle);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500)
          });
      }) 
      .catch(err => {
        res.sendStatus(404);
      }) 
  });

  app.delete('/notes/:id/:noteid', function(req, res) {
    var noteId = req.params.noteid;
    var articleId = req.params.id;
    db.Note
      .deleteOne({_id: mongoose.Types.ObjectId(noteId)})
      .then((dbNote) => {
        db.Article
          .find({_id: mongoose.Types.ObjectId(articleId)})
          .populate('note')
          .then((dbArticle) => {
            console.log(dbArticle);
            res.sendStatus(200);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500)
          }); 
        })    
      .catch(err => {
        console.log(err);
        res.sendStatus(404);
      });
  });
}


module.exports = startApp;
