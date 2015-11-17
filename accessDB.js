var db = require('mongoskin').db('mongodb://localhost:27017/AnnonLoc');
var ObjectID = require('mongoskin').ObjectID;
var host = 'http://ec2-52-88-224-149.us-west-2.compute.amazonaws.com:3000';

exports.getNearbyLocation = function(req, res, next) {

    db.collection('location')
        .find(
            { 'loc': 
                { 
                    '$near': [ 
                        parseFloat(req.query.longitude), 
                        parseFloat(req.query.latitude) 
                    ] 
                } 
            }
        )
        .toArray(function(err, locations) {
            if (err) { 
                console.log(err);
                throw err; 
            }
            var locs = [];
            var lid = [];
            for (var i=0;i<locations.length;i++) {
                locs.push({ 
                    '_id' : locations[i]._id,
                    'name' : locations[i].name,
                    'loc' : locations[i].loc,
                    'img' : host + locations[i].img
                });
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
        return { 'comments': values.slice(0, end) }; 
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
                var map = []; 
                for (var i=0;i<r.length;i++) {
                    map[r[i]._id] = r[i].value.comments;
                }
                req.map = map;
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
       'text': req.body.text,
       'locId': new ObjectID(req.params.lid),
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

