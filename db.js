var fsm = require('./fsm');

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID

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



exports.replace_questions = function(competition_id, new_questions, callback) {
    database.collection('questions').remove({competition: competition_id}, function(err, result) {
        if (err) callback(err);
        console.log('removed all questions');
        
        database.collection('questions').insertMany(new_questions, function(err, result) {
            if (err){
                callback(err);
            }else {
                console.log('saved all questions to database');


                var slideshow = fsm.create_slideshow(competition_id, new_questions);

                database.collection('slideshow').remove({competition: competition_id}, function(err, result) {
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
    database.collection('slideshow').find({competition: competition_id}).toArray(function(err, result) {
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
                callback(true,"Index out of bounds! Index: " + (index+offset));
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
    database.collection('questions').find({competition: competition_id}).toArray(function(err, result) {
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



// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

exports.get_users = function(callback) {
    database.collection('users').find({}).toArray(function(err, result) {
        callback(err, result);
    });
};
exports.get_cities = function(callback) {
    database.collection('cities').find({}).toArray(function(err, result) {
        callback(err, result);
    });
};
exports.get_competitions = function(callback) {
    database.collection('competitions').find({}).toArray(function(err, result) {
        callback(err, result);
    });
};
exports.get_teams = function(competitionId, callback){
    database.collection('teams').find({competition: competitionId}).toArray(function(err, result) {
        callback(err, result);
    });
};
exports.get_team = function(teamId, callback){
    database.collection('teams').find({_id: ObjectID(teamId)}).toArray(function(err, result) {
        callback(err, result);
    });
};

exports.update_user = function(user, callback) {
    user._id =  ObjectID(user._id);
    database.collection('users').update({_id: user._id}, user, function(err, result) {
        callback(err);
    });
};
exports.update_city = function(city, callback) {
    city._id = ObjectID(city._id);
    database.collection('cities').update({_id: city._id}, city, function(err, result) {
        callback(err);
    });
};
exports.update_competition = function(competition, callback) {
    competition._id = ObjectID(competition._id);
    database.collection('competitions').update({_id: competition._id}, competition, function(err, result) {
        callback(err);
    });
};
exports.update_team = function(team, callback){
    team._id = ObjectID(team._id);
    database.collection('teams').update({_id: team._id}, team, function(err, result) {
        callback(err);
    });
};

exports.add_user = function(user, callback) {
    database.collection('users').insert(user, function(err, result) {
        callback(err, result.insertedIds['0']);
    });
};
exports.add_city = function(city, callback) {
    database.collection('cities').insert(city, function(err, result) {
        callback(err, result.insertedIds['0']);
    });
};
exports.add_competition = function(competition, callback) {
    database.collection('competitions').insert(competition, function(err, result) {
        callback(err, result.insertedIds['0']);
    });
};
exports.add_team = function(team, callback){
    database.collection('teams').insert(team, function(err, result) {
        callback(err, result.insertedIds['0']);
    });
};


exports.delete_user = function(userId, callback) {
    database.collection('users').remove({_id: ObjectID(userId)}, function(err, result) {
        callback(err);
    });
};
exports.delete_city = function(cityId, callback) {
    database.collection('cities').remove({_id: ObjectID(cityId)}, function(err, result) {
        callback(err);
    });
};
exports.delete_competition = function(compId, callback) {
    database.collection('competitions').remove({_id: ObjectID(compId)}, function(err, result) {
        callback(err);
    });
};
exports.delete_team = function(teamId, callback){
    database.collection('teams').remove({_id: ObjectID(teamId)}, function(err, result) {
        callback(err);
    });
};

