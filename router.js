var express = require('express');
var router = express.Router();
var db = require('mongoskin')
    .db('mongodb://localhost:27017/AnnonLoc');
var ObjectID = require('mongoskin').ObjectID;
var host = 'http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000';

getNearbyLocation = function(req, res, next) {
    db.collection('location')
        .find()
        .toArray(function(err, locations) {
            if (err) { 
                console.log(err);
                throw err; 
            }
            var locs = [];
            var lid = [];
            for (var i=0;i<locations.length;i++) { 
                locs[locations[i]._id] = { 
                    'name' : locations[i].name,
                    'latitude' : locations[i].latitude,
                    'longitude' : locations[i].longitude,
                    'img' : host + locations[i].img
                }
                lid.push(locations[i]._id);
            }
            req.locations = locs;
            req.lid = lid;
            next(); 
        }); 
};

getCommentByLocation = function(req, res, next) {

    var query = { 
        'locId': { $in: req.lid },
    };
    var mapper = function() { 
        emit(this.locId, { 'time': this.time, 'text': this.text }); 
    };
    var reducer = function(key, values) {
        values.sort(function(a,b) {
            return new Date(b.time) > new Date(b.time)? -1 : 1;
        });
        var end = (values.length < 3)? values.length : 3;
        return { 'comment': values.slice(0, end) }; 
    };

    // Utilize mongodb mapReduce to group comments into array
    db.collection('comment')
        .mapReduce(
        mapper,
        reducer,
        {
            query: query,
            out: 'result'
        },
        function(err, collection) {
            if (err) {  
                console.log(err);
                throw err;
            }
            collection
                .find()
                .toArray(function(err, r) {
                req.result = r;
                next();
            });
        });
};

convertFormat = function(req, res, next) {
    var result = req.result; 
    var locations = req.locations;
    for (var i=0;i<result.length;i++) {
        result[i].value.loc_info = locations[result[i]._id];
    }
    res.json(result); 
}

/**
 * Receive location coordinates and retrieve nearby locations
 * and associated comments
 */
router.get(
    '/locations', 
    getNearbyLocation, 
    getCommentByLocation,
    convertFormat);

/**
 * Receive location id and retrieve the information of the specified 
 * location (all the comment/coordinate). Sorted by timestamp
 */
router.get('/locations/:lid', function(req, res, next) {
    var lid = new ObjectID(req.params.lid);
    
    db.collection('comment')
        .find(
            { 'locId': lid }, 
            { sort: { 'time': -1 } })
        .toArray(function(err, comments) {
            if (err) {
                console.log(err);
                throw err; 
            }
            res.json(comments);
        });
});

/**
 * Receive post for specified location and retrieve comments
 */
router.post('/locations/:lid', function(req, res, next) {
    var newComment = {
       'text': req.params.text,
       'locId': req.params.locId,
       'time': new Date().toISOString()
    };
    db.collection('comment')
        .insert(newComment, function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            res.end(req, res);
        });    
});

/**
 * Receive coordinates/name/category to create new location
 */
router.post('/locations', function(req, res, next) {
    res.send("create a new location");
});

module.exports = router;
