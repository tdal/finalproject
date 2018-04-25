var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); // geocoder library

// our db model
var Dream = require("../models/model.js");

// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really just for testing
router.get('/create-dream', function(req,res){
  res.render('dream-form.html')
})

router.get('/create-dream-location', function(req,res){
  res.render('dream-form-with-location.html')
})

// simple route to render an HTML page that pulls data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/show-dreams', function(req,res){
  res.render('show-dreams.html')
})

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new animal, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var date = req.body.date;
    var length = req.body.length;
    var synopsis = req.body.synopsis;
    var tags = req.body.tags.split(","); // split string into array
    var snore = req.body.snore;
    var awake = req.body.awake;
    var stress = req.body.stress;
    var url = req.body.url;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var dreamObj = {
      date: date,
      length: length,
      synopsis: synopsis,
      tags: tags,
      description: {
        snore: snore,
        awake: awake
      },
      stress: stress,
      url: url
    };

    // create a new animal model instance, passing in the object
    var dream = new Dream(dreamObj);

    // now, save that animal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    dream.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving dream'};
        return res.json(error);
      }

      console.log('saved a new dream!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        dream: data
      }

      //return res.json(jsonData);
      return res.redirect('/show-dreams')

    })
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the animal to get
//  * @param  {String} req.params.id - The animalId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Dream.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that dream'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      dream: data
    }

    return res.json(jsonData);

  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Dream.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find dreams'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      dreams: data
    }

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search an animal
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.date;
  console.log("we are searching for " + searchTerm);

  // let's find that animal
  Dream.find({name: searchTerm}, function(err,data){
    // if err, respond with error
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no animals, respond with no animals message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      dreams: data
    }

    res.json(jsonData);
  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.params.id - The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.params.id;

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var date, length, synopsis, snore, awake, stress, url;

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.date) {
      date = req.body.date;
      // add to object that holds updated data
      dataToUpdate['date'] = date;
    }
    if(req.body.length) {
      length = req.body.length;
      // add to object that holds updated data
      dataToUpdate['length'] = length;
    }
     if(req.body.synopsis) {
      synopsis = req.body.synopsis;
      // add to object that holds updated data
      dataToUpdate['synopsis'] = synopsis;
    }
    if(req.body.snore) {
      snore = req.body.snore;
      // add to object that holds updated data
      dataToUpdate['description'] = {};
      dataToUpdate['description']['snore'] = snore;
    }
    if(req.body.awake) {
      awake = req.body.awake;
      // add to object that holds updated data
      if(!dataToUpdate['description']) dataToUpdate['description'] = {};
      dataToUpdate['description']['awake'] = awake;
    }
     if(req.body.stress) {
      synopsis = req.body.stress;
      // add to object that holds updated data
      dataToUpdate['stress'] = stress;
    }
    if(req.body.url) {
      url = req.body.url;
      // add to object that holds updated data
      dataToUpdate['url'] = url;
    }
    var tags = []; // blank array to hold tags
    if(req.body.tags){
      tags = req.body.tags.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that animal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Dream.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating animal'};
        return res.json(error);
      }

      console.log('updated the dream!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        dream: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.params.id - The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Dream.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that dream to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

// examples of a GET route using an HTML template

router.get('/dreams', function(req,res){

  Dream.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find dreams'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var templateData = {
      status: 'OK',
      dreams: data
    }

    res.render('dream-template.html',templateData);

  })

})

module.exports = router;


// examples of a GET route using an HTML template
router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Dream.findById(requestedId, function(err,data){
    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that dream'};
       return res.json(error);
    }

    // otherwise preprate data of the animal
    var templateData = data;

    return res.render('edit-form.html', templateData);

  })
})

router.post('/api/create/location', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var date = req.body.date;
    var length = req.body.length;
    var synopsis = req.body.synopsis;
    var tags = req.body.tags.split(","); // split string into array
    var snore = req.body.snore;
    var awake = req.body.awake;
    var stress = req.body.stress;
    var url = req.body.url;
    var location = req.body.location;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var dreamObj = {
      date: date,
      length: length,
      synopsis: synopsis,
      tags: tags,
      description: {
        snore: snore,
        awake: awake
      },
      stress: stress,
      url: url
    };

  // if there is no location, return an error
    if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

    console.log('location is --> ' + location);
    //now, let's geocode the location
    geocoder.geocode(location, function (err,data) {

      // if we get an error, or don't have any results, respond back with error
      if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
        var error = {status:'ERROR', message: 'Error finding location'};
        return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
      }

      console.log(data);
      // else, let's pull put the lat lon from the results
      var lon = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;

      // now, let's add this to our animal object from above
      dreamObj.location = {
        geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
        name: data.results[0].formatted_address // the location name
      }

      // now, let's save it to the database
      // create a new animal model instance, passing in the object we've created
      var dream = new Dream(dreamObj);

      // now, save that animal instance to the database
      // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
      dream.save(function(err,data){
        // if err saving, respond back with error
        if (err){
          var error = {status:'ERROR', message: 'Error saving dream'};
          return res.json(error);
        }

        console.log('saved a new dream!');
        console.log(data);

        // now return the json data of the new animal
        var jsonData = {
          status: 'OK',
          dream: data
        }

        return res.json(jsonData);

      })

    });
});

module.exports = router;
