var express = require('express');
var router = express.Router();
var accessDB = require('./accessDB');

convertFormat = function(req, res, next) {
    var result = req.result; 
    var locations = req.locations;
    for (var i=0;i<result.length;i++) {
        result[i].value.loc_info = locations[result[i]._id];
    }
    res.json(result); 
};


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
    accessDB.getCommentsByLocation);

/**
 * Receive post for specified location and retrieve comments
 */
router.post(
    '/locations/:lid',
    accessDB.writeNewComment,
    accessDB.getCommentsByLocation);

/**
 * Receive coordinates/name/category to create new location
 */
router.post('/locations', function(req, res, next) {
    res.send("create a new location");
});

module.exports = router;
