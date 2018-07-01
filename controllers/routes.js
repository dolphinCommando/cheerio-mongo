var cheerio = require('cheerio');
var request = require('request');
var db = require('../models');

const startApp = function(app) {
  app.get('/', function(req, res) {
    scrape().then((success) => {
      console.log(success);
      db.Article.find().then((data) => {
        res.render('index', {article: data});
      }).catch(err => {
        console.log(err);
        res.send(404)
      });  
    }).catch(err => {
      console.log(err);
      res.send(404);
    });
  });
}

function scrape() {
  return new Promise((resolve, reject) => {
    request('https://www.nytimes.com/', function (error, response, html) {
      if (error) {
        reject('Could not request site');
      }
      console.log('request statusCode:', response && response.statusCode); 
      const $ = cheerio.load(html);
      $('.theme-summary').each((i, elem) => {
        if ($(elem).children('.story-heading').text()) {
          db.Article.create({
            title: $(elem).children('.story-heading').text().trim(),
            link: $(elem).children('.story-heading').children('a').attr('href'),
            byline: $(elem).children('.byline').text().trim(), 
            summary: $(elem).children('.summary').text().trim()
          })
          .then(function(res) {
            //console.log('Scrape OK!  ' + res);
            resolve('NYT Scrape OK.');
          })
          .catch(function(err) {
            reject('Error in cheerio');
          });          
        }  
      });
      /*
      db.Article.create(data)
        .then(function(res) {
          console.log(res);
          resolve('Okay');
        })
        .catch(function(err) {
          reject('Error in cheerio');
        });
      */
    });
  });
}


module.exports = startApp;
