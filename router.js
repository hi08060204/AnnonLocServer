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

genRandomName = function(req, res, next) {
    var adj_id = Math.floor(Math.random() * adj_list.length);
    var n_id = Math.floor(Math.random() * noun_list.length);
    var output = { 
        "name" : adj_list[adj_id] + " " + noun_list[n_id],
        "icon_url" : ""
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
    '/locations', 
    accessDB.getNearbyLocation, 
    accessDB.getLatestComments,
    convertFormat);

/**
 * Receive location id and retrieve the information of the specified 
 * location (all the comment/coordinate). Sorted by timestamp
 */
router.get(
    '/locations/:lid', 
    accessDB.isLocationValid,
    accessDB.getCommentsByLocation);

/**
 * Receive post for specified location and retrieve comments
 */
router.post(
    '/locations/:lid',
    accessDB.isLocationValid,
    accessDB.writeNewComment,
    accessDB.getCommentsByLocation);

/**
 * Receive coordinates/name/category to create new location
 */
router.post('/locations', function(req, res, next) {
    res.send("create a new location");
});

module.exports = router;
