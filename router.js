var express = require('express');
var router = express.Router();

/**
 * Receive location coordinates and retrieve nearby locations
 * and associated comments
 */
router.get('/stories', function(req, res, next) {
    res.send("!!!!!");
});

/**
 * Receive post for specified location and retrieve comments
 */
router.post('/post', function(req, res, next) {
    res.send("post");
});

/**
 * Receive coordinates/name/category to create new location
 */
router.post('/create', function(req, res, next) {
    res.send("create");
});
module.exports = router;
