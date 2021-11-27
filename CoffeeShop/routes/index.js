var monk = require('monk');
var db = monk('localhost:27017/coffee-shop');

var collection = db.get('drinks');

var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

var small = {"serving_size": 8, "caffeine": "75", "price": "4"}
var medium = {"serving_size": 12, "caffeine": "270", "price": "5"}
var large = {"serving_size": 16, "caffeine": "360", "price": "6"}

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    
    if (err) {
          return res.render('exist', { account : account });
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/drinks');
      });
  });
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/drinks');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//List all drinks
//Includes search and filter functionalities
router.get("/drinks", function (req, res) {
  console.log(req.query);
  if (
    (!req.query.search && !req.query.category) ||
    (req.query.search == "" && req.query.category == "all")
  ) {
    var collection = db.get("drinks");
    collection.find({}, function (err, drinks) {
      if (err) throw err;
      res.render("drinks", { results: drinks });
    });
  } else if (req.query.search != "" && req.query.category == "all") {
    var collection = db.get("drinks");
    var regex = new RegExp([req.query.search].join(""), "i");
    collection.find({ type: regex }, function (err, drinks) {
      if (err) throw err;
      res.render("drinks", { results: drinks });
    });
  } else if (req.query.search != "" && req.query.drinks != "all") {
    var collection = db.get("drinks");
    var regex = new RegExp([req.query.search].join(""), "i");
    var regexG = new RegExp([req.query.category].join(""), "i");
    collection.find({ type: regex, category: regexG }, function (err, drinks) {
      if (err) throw err;
      res.render("drinks", { results: drinks });
    });
  } else if (req.query.search == "" && req.query.search != "all") {
    var collection = db.get("drinks");
    var regexG = new RegExp([req.query.category].join(""), "i");
    collection.find({ category: regexG }, function (err, drinks) {
      if (err) throw err;
      res.render("drinks", { results: drinks });
    });
  }
});

//Show new drink form
router.get('/drinks/new', function(req, res) {
  res.render('new');
});

//Create new drink
router.post('/drinks', function(req, res){
  collection.insert({
      type:req.body.type,
      category:req.body.category,
      description:req.body.description,
      image: "americano.jpg",
      standard_calories:req.body.standard_calories,
      ingredients:req.body.ingredients,
      small:req.body.small,
      medium:req.body.medium,
      large:req.body.large
  }, function(err, drink) {
      if (err) throw err;
      res.redirect('/drinks');
  }) 
});

//Delete a drink
router.delete('/drinks/:id', function(req, res){
  var collection = db.get('drinks');
  collection.remove({_id: req.params.id}, function(err, drink) {
      if (err) throw err;
      res.redirect('/drinks');
  }) 
});

//Edit a drink
router.get('/drinks/:id/edit', function(req, res){
  collection.findOne({_id: req.params.id}, function(err, result) {
    if (err) throw err;
    res.render('edit', {result : result});
}) 
});

//Update a drink
router.post('/drinks/:id/save_edit', function(req, res){
  var collection = db.get('drinks');
  collection.findOneAndUpdate(
      {_id : req.params.id},
      
      { $set : {
      type:req.body.type,
      category:req.body.category,
      image:req.body.image,
      description:req.body.description,
      standard_calories:req.body.standard_calories,
      ingredients:req.body.ingredients,
      small:req.body.small,
      medium:req.body.medium,
      large:req.body.large
      }}, 

      function(err, drink) {
      if (err) throw err;
      res.redirect('/drinks');
  }) 
});

//Show a drink
router.get('/drinks/:id', function(req, res){

  collection.findOne({_id: req.params.id}, function(err, drink) {
      if (err) throw err;
      res.render('show', {drink: drink});

  }) 
});

//Show cart
router.get('/add', function(req, res) {
  res.render('cart');
});

//Add item to cart
router.post('/cart', function(req, res){
  var col = db.get('cart');
  col.insert({
      user : req.user,
  }, function(err, drink) {
      if (err) throw err;
      res.redirect('/drinks');
  }) 
});

//Show history
router.get('/history', function(req, res) {
  res.render('history');
});

module.exports = router;