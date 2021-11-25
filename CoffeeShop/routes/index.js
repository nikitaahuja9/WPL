var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/coffee-shop');

var collection = db.get('drinks');

router.get('/', function(req, res, next) {
  res.redirect('/drinks');
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
      res.render("index", { results: drinks });
    });
  } else if (req.query.search != "" && req.query.category == "all") {
    var collection = db.get("drinks");
    var regex = new RegExp([req.query.search].join(""), "i");
    collection.find({ type: regex }, function (err, drinks) {
      if (err) throw err;
      res.render("index", { results: drinks });
    });
  } else if (req.query.search != "" && req.query.drinks != "all") {
    var collection = db.get("drinks");
    var regex = new RegExp([req.query.search].join(""), "i");
    var regexG = new RegExp([req.query.category].join(""), "i");
    collection.find({ type: regex, category: regexG }, function (err, drinks) {
      if (err) throw err;
      res.render("index", { results: drinks });
    });
  } else if (req.query.search == "" && req.query.search != "all") {
    var collection = db.get("drinks");
    var regexG = new RegExp([req.query.category].join(""), "i");
    collection.find({ category: regexG }, function (err, drinks) {
      if (err) throw err;
      res.render("index", { results: drinks });
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
      ingredients:req.body.ingredients
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
      ingredients:req.body.ingredients
      }}, 

      function(err, drink) {
      if (err) throw err;
      res.redirect('/');
  }) 
});

//Show a drink
router.get('/drinks/:id', function(req, res){

  collection.findOne({_id: req.params.id}, function(err, drink) {
      if (err) throw err;
      res.render('show', {drink: drink});

  }) 
});

module.exports = router;