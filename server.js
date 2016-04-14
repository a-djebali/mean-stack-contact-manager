var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongojs = require('mongojs');

var PORT = process.env.PORT || 3000;
var db = mongojs('contacts', ['contacts']);
var app = express();

//Anytime a json request comes in express will parse it, so we can access it 
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/contacts', function(req, res) {
  db.contacts.find(function(err, docs) {
    if (!!docs) {
      res.json(docs);
    } else {
      res.json(err);
    }
  });
});

app.get('/contacts/:id', function(req, res) {
  var contactId = req.params.id;
  db.contacts.findOne({
    _id: mongojs.ObjectId(contactId)
  }, function(err, doc) {
    if (!!doc) {
      res.json(doc);
    } else {
      res.json(err);
    }
  });
});

app.post('/contacts', function(req, res) {
  db.contacts.insert(req.body, function(err, docs) {
    res.json(docs);
  })
});

app.put('/contacts/:id', function(req, res) {
  var contactId = req.params.id;
  db.contacts.findAndModify({
    query: {
      _id: mongojs.ObjectId(contactId)
    },
    update: {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      }
    },
    new: true
  }, function(err, docs) {
    res.json(docs);
  });
});

app.delete('/contacts/:id', function(req, res) {
  var contactId = req.params.id;
  db.contacts.remove({
    _id: mongojs.ObjectId(contactId)
  }, function(err, docs) {
    res.json(docs);
  });
});



app.listen(PORT, function() {
  console.log('server started, checkout http://localhost:' + PORT);
});