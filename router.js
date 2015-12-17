var express = require('express');
var router = express.Router();
var accessDB = require('./accessDB');

var adj_list = [
                    "stupid",
                    "beautiful",
                    "elegant",
                    "brave"
                ];
var noun_list = [
                    "apple",
                    "orange",
                    "cat",
                    "dog"
                ];

var icon_number = 40;

genRandomName = function(req, res, next) {
    var adj_id = Math.floor(Math.random() * adj_list.length);
    var n_id = Math.floor(Math.random() * noun_list.length);
    var icon_id = Math.floor(Math.random() * icon_number);
    var output = { 
        "name" : adj_list[adj_id] + " " + noun_list[n_id],
        "icon_id" : icon_id.toString()
    }
    res.send(output);
};


convertFormat = function(req, res, next) {
    var map = req.map; 
    var locations = req.locations;
    var result = [];
    for (var i=0;i<locations.length;i++) {
        result.push({
            '_id' : locations[i]._id,
            'name' : locations[i].name,
            'loc' : locations[i].loc,
            'img' : locations[i].img,
            'comments' : map[locations[i]._id]
        });
    }
    res.json(result); 
};

router.get('/randomId',
        genRandomName);

/**
 * Receive location coordinates and retrieve nearby locations
 * and associated comments
 */
router.get(
    '/nearLocations', 
    accessDB.getNearbyLocation, 
    accessDB.aggregateComments,
    convertFormat);

/**
 * Receive location id and retrieve the information of the specified 
 * location (all the comment/coordinate). Sorted by timestamp
 */
router.get(
    '/locations/:lid/comments', 
    accessDB.isLocationValid,
    accessDB.getCommentsByLocation);

/**
 * Receive post for specified location and retrieve comments
 */
router.post(
    '/locations/:lid/comments',
    accessDB.isLocationValid,
    accessDB.writeNewComment,
    accessDB.getCommentsByLocation);

/**
 * Receive coordinates/name/category to create new location
 */
router.post('/locations', function(req, res, next) {
    res.send("create a new location");
});

router.get(
    '/locations/:lid', 
    accessDB.isLocationValid,
    accessDB.getLocationById,
    accessDB.aggregateComments,
    convertFormat);

router.get('/comments', function(req, res, next) {
    res.send("get all comments");
});

module.exports = router;
