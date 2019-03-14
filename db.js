var fsm = require('./fsm');

var MongoClient = require('mongodb').MongoClient

var database;
MongoClient.connect('mongodb://localhost:27017/', function (err, db) {
    if (err) throw err
    database = db.db('teknikattan');

    /*
    database.collection('questions').find().toArray(function(err, result) {
        if (err) throw err;
        fsm.set_questions(result);
    });*/
})

// TODO: Should be a database call instead of here in source code
var teams = [{id: 30, name: "Röde 2047", scores: [0,0,0,0,0,0,0,0]}, {id: 31, name: "Sami UU", scores: [0,0,0,0,0,0,0,0]}, {id: 32, name: "Peter LiU", scores: [0,0,0,0,0,0,0,0]}];

    


exports.replace_questions = function(competition_id, new_questions, callback) {
    database.collection('questions').remove({competition: parseInt(competition_id)}, function(err, result) {
        if (err) callback(err);
        console.log('removed all questions');
        
        database.collection('questions').insertMany(new_questions, function(err, result) {
            if (err){
                callback(err);
            }else {
                console.log('saved all questions to database');


                var slideshow = fsm.create_slideshow(parseInt(competition_id), new_questions);

                database.collection('slideshow').remove({competition: parseInt(competition_id)}, function(err, result) {
                    if (err) callback(err);
                    console.log('removed all views from slideshow');                    
                    database.collection('slideshow').insertMany(slideshow, function(err, result) {
                        if (err){
                            callback(err);
                        } else {
                            console.log('saved all views from slideshow');
                            callback(false);
                        }
                    });
                });
            }
        });
    });
};


exports.get_slideshow = function(competition_id, callback) {
    database.collection('slideshow').find({competition: parseInt(competition_id)}).toArray(function(err, result) {
        callback(err, result);
    });
}


exports.get_slide = function(competition_id, offset = 0, callback){ 
    exports.get_index(competition_id, function(err, index){
        if (err) throw err;
        exports.get_slideshow(competition_id, function(err, result){
            if (err) throw err;
            if(index+offset < result.length && index+offset >= 0){
                callback(false, result[index+offset]);
            }else{
                callback("Index out of bounds! Index: " + (index+offset));
            }
        });
    });
}



var index = 0; // TODO: Should be retrieved from database
exports.get_index = function(competition_id, callback){
    callback(false, index);
}

exports.increase_index = function(competition_id, callback){
    index++;
    callback(false);
}

exports.decrease_index = function(competition_id, callback){
    index--;
    callback(false);
}

exports.get_questions = function(competition_id, callback) {
    database.collection('questions').find({competition: parseInt(competition_id)}).toArray(function(err, result) {
        callback(err, result);
    });
};

exports.save_answer = function(teamId, questionIndex, answers, callback){
    database.collection('answers').update({team: teamId, question: questionIndex}, {team: teamId, question: questionIndex, answers: answers}, {upsert: true}, function(err, result) {
        callback(err);
    });
}


exports.get_answer = function(teamId, questionIndex, callback){
    database.collection('answers').find({team: teamId, question: questionIndex}).toArray(function(err, result) {
        callback(err, result);
    });
};

exports.save_score = function(teamId, scores, callback){
    // TODO: Save to database
    for(var t = 0; t < teams.length; t++){
        if(teams[t].id == teamId){
            teams[t].scores = scores;
            callback(false);
            return;
        }
    }
    console.log("Couldn't find a team with ID: " + req.body.team);
    callback(true);
}


exports.get_team = function(teamId, callback){
    for(var t = 0; t < teams.length; t++){
        if(teams[t].id == teamId){
            callback(false,teams[t]);
            return;
        }
    }
    callback(true,{});
};


exports.get_teams = function(competitionId, callback){
    callback(false, teams);
};



// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

exports.create_user = function (name, callback) {
  showsdb.insert({
    name: name,
    default: false,
    created: new Date(),
    keyframes: []
  }, function (err) {
    if (err) callback(err);
    else exports.get_shows(callback);
  });
};

exports.delete_user = function (id, callback) {
  showsdb.remove({ _id: id }, {}, function (err) {
    if (err) callback(err);
    else exports.get_shows(callback);
  });
};

exports.get_users = function (callback) {
  showsdb.find({}).sort({ created: -1 }).exec(function (err, shows) {
    callback(err, shows.map(function (show) { return {
      _id: show._id,
      name: show.name,
      default: show.default,
      created: show.created
    }}));
  })
};

exports.copy_user = function (id, name, callback) {
  showsdb.findOne({ _id: id }, function (err, show) {
    if (err) callback(err);
    else {
      delete show["_id"];
      show.default = false;
      show.created = new Date();
      show.name = name;
      showsdb.insert(show, function (err) {
        if (err) callback(err);
        else exports.get_shows(callback);
      });
    }
  });
};

exports.rename_user = function (id, name, callback) {
  showsdb.update({ _id: id}, { $set: { name: name } }, {}, function (err) {
    if (err) callback(err);
    else exports.get_shows(callback);
  });
};

exports.get_user = function (id, callback) {
  showsdb.findOne({ _id: id }, callback);
};

exports.set_user = function (show, callback) {
  showsdb.update({ _id: show._id }, show, {}, function (err) {
    if (err) callback(err);
    else exports.get_show(show._id, callback);
  });
};

