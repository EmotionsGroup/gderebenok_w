var express = require('express');
var router = express.Router();
var Location = require('../models/location');
var MongoClient = require('mongodb').MongoClient;
var net = require('net');


router.get('/locations', function (req, res) {
  MongoClient.connect('mongodb://104.236.214.102:21481/db', function(err, db) {
    if(err) {
      throw err;
    }
    db.collection('messlist').find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
      console.log(result+'sdfsdf ');
      res.render('locations', { title: 'Coordinates', subtitle : 'Raw data', result : result });




    });
  });
});


router.get('/maps', function (req, res) {
  MongoClient.connect('mongodb://104.236.214.102:21481/db', function(err, db) {
    if(err) {
      throw err;
    }
    db.collection('messlist').find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
      console.log(result + ' maps ' );

      res.render('maps', { title: 'Карта', subtitle : 'Местоположение устройства на карте', result : result });
    });
  });
});


router.get('/api/locationsList', function (req, res) {
  MongoClient.connect('mongodb://104.236.214.102:21481/db', function(err, db) {
    if(err) {
      throw err;
    }
    db.collection('messlist').find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
      console.log(result);
      res.json(result);
    });
  });
});


module.exports = router;
