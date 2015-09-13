var db = require('mongoskin')
    .db('mongodb://localhost:27017/AnnonLoc');
var ObjectID = require('mongoskin').ObjectID;
var host = 
    'http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000';

exports.getNearbyLocation = function(req, res, next) {
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

exports.getLatestComments = function(req, res, next) {

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

exports.getCommentsByLocation = function(req, res, next) {
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
};

exports.writeNewComment = function(req, res, next) {
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
            next();
        });    
};

