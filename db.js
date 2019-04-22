var fsm = require('./fsm');

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID

var database;
MongoClient.connect('mongodb://localhost:27017/', function (err, db) {
    if (err) throw err;
    database = db.db('teknikattan');
})



exports.replace_questions = function(competition_id, new_questions, callback) {
    database.collection('questions').remove({competition: competition_id}, function(err, result) {
        if (err) return callback(err);
        console.log('removed all questions');
        
        database.collection('questions').insertMany(new_questions, function(err, result) {
            if (err){
                return callback(err);
            }else {
                console.log('saved all questions to database');

                // Set length of scores and answers arrays in the teams belonging to this competition
                var scores = Array(new_questions.length).fill(0);
                var answers = Array(new_questions.length).fill([]);
                database.collection('teams').update({competition: competition_id}, {$set: {answers: answers, scores: scores}}, {multi: true}, function(err, result){
                    if(err) return callback(err);
                });

                var slideshow = fsm.create_slideshow(competition_id, new_questions);

                database.collection('slideshow').remove({competition: competition_id}, function(err, result) {
                    if (err) return callback(err);
                    console.log('removed all views from slideshow');
                    database.collection('slideshow').insertMany(slideshow, function(err, result) {
                        if (err){
                            return callback(err);
                        } else {
                            console.log('saved all views from slideshow');
                            return callback(false);
                        }
                    });
                });
            }
        });
    });
};


exports.get_slideshow = function(competition_id, callback) {
    database.collection('slideshow').find({competition: competition_id}).toArray(function(err, result) {
        return callback(err, result);
    });
}


exports.get_slide = function(competition_id, offset = 0, callback){ 
    exports.get_index(competition_id, function(err, index){
        if (err) return callback(err);
        exports.get_slideshow(competition_id, function(err, result){
            if (err) return callback(err);
            if(index+offset >= result.length){
                return callback(false, result[result.length-1]);
            }else if(index+offset < 0){
                return callback(false, result[0]);
            }else{
                return callback(false, result[index+offset]);
            }
        });
    });
}


exports.get_index = function(competition_id, callback){
    database.collection('competitions').findOne({_id: ObjectID(competition_id)}, function(err, result) {
        return callback(err, result.index);
    });
}

exports.increase_index = function(competition_id, callback){
    database.collection('slideshow').count({competition: competition_id}, function(err, count) {
        database.collection('competitions').update({_id: ObjectID(competition_id), index: {$lt: count-1}}, {$inc: { index: 1}}, function(err, result) {
            return callback(err);
        });
    });
}

exports.decrease_index = function(competition_id, callback){
    database.collection('competitions').update({_id: ObjectID(competition_id), index: {$gt: 0}}, {$inc: { index: -1}}, function(err, result) {
        return callback(err);
    });
}

exports.get_questions = function(competition_id, callback) {
    database.collection('questions').find({competition: competition_id}).toArray(function(err, result) {
        return callback(err, result);
    });
};

exports.save_answer = function(teamId, questionIndex, answers, callback){
    var values= {}
    values["answers"] = answers;
    database.collection('teams').update({_id: ObjectID(teamId)}, {$set: values}, function(err, result) {
        return callback(err);
    });
}


// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
exports.check_user = function(name, password, callback) {
    database.collection('users').findOne({name: name, password: password}, function(err, result) {
        return callback(err, result);
    });
};
exports.get_users = function(city, callback) {
    if(city == "5c8d4b84ad225235d0178b95"){
        database.collection('users').find({}).toArray(function(err, result) {
            return callback(err, result);
        });
    }else{
        database.collection('users').find({city: city}).toArray(function(err, result) {
            return callback(err, result);
        });
    }
};
exports.get_cities = function(city, callback) {
    if(city == "5c8d4b84ad225235d0178b95"){
        database.collection('cities').find({}).toArray(function(err, result) {
            return callback(err, result);
        });
    }else{
        database.collection('cities').find({_id: ObjectID(city)}).toArray(function(err, result) {
            return callback(err, result);
        });
    }
};
exports.get_competitions = function(city, callback) {
    if(city == "5c8d4b84ad225235d0178b95"){
        database.collection('competitions').find({}).toArray(function(err, result) {
            return callback(err, result);
        });
    }else{
        database.collection('competitions').find({city: city}).toArray(function(err, result) {
            return callback(err, result);
        });
    }
};
exports.get_teams = function(competitionId, callback){
    database.collection('teams').find({competition: competitionId}).toArray(function(err, result) {
        return callback(err, result);
    });
};
exports.get_team = function(teamId, callback){
    database.collection('teams').findOne({_id: ObjectID(teamId)}, function(err, result) {
        return callback(err, result);
    });
};

exports.update_user = function(user, callback) {
    user._id =  ObjectID(user._id);
    database.collection('users').update({_id: user._id}, user, function(err, result) {
        return callback(err);
    });
};
exports.update_city = function(city, callback) {
    city._id = ObjectID(city._id);
    database.collection('cities').update({_id: city._id}, city, function(err, result) {
        return callback(err);
    });
};
exports.update_competition = function(competition, callback) {
    competition._id = ObjectID(competition._id);
    database.collection('competitions').update({_id: competition._id}, competition, function(err, result) {
        return callback(err);
    });
};
exports.update_team = function(team, callback){
    team._id = ObjectID(team._id);
    database.collection('teams').update({_id: team._id}, team, function(err, result) {
        return callback(err);
    });
};

exports.add_user = function(user, callback) {
    database.collection('users').insert(user, function(err, result) {
        return callback(err, result.insertedIds['0']);
    });
};
exports.add_city = function(city, callback) {
    database.collection('cities').insert(city, function(err, result) {
        return callback(err, result.insertedIds['0']);
    });
};
exports.add_media = function(media, callback) {
    database.collection('media').insert(media, function(err, result) {
        return callback(err);
    });
};
exports.add_competition = function(competition, cloned_from_compId, callback) {
    database.collection('competitions').insert(competition, function(err, result) {
        var new_compId = result.insertedIds['0'] + "";
        
        if(cloned_from_compId){
            database.collection('questions').find({competition: cloned_from_compId}).toArray(function(err, questions) {
                if(err) return callback(err);
                for(var i = 0; i < questions.length; i++){
                    questions[i].competition = new_compId;
                    delete questions[i]._id;
                }
                exports.replace_questions(new_compId, questions, function(err, result){
                    if(err) return callback(err);
                    return callback(err, new_compId);
                });
            });
        }else{
            return callback(err, new_compId);
        }
    });
};
exports.add_team = function(team, callback){
    
    database.collection('questions').count({competition: team.competition}, function(err, result){
        if(err) return callback(err);
        console.log("Antal frågor: " + result);
        team.scores = Array(result).fill(0);
        team.answers = Array(result).fill([]);

        database.collection('teams').insert(team, function(err, result) {
            return callback(err, result.ops[0]);
        });
        
    });
    
};


exports.delete_user = function(userId, callback) {
    database.collection('users').remove({_id: ObjectID(userId)}, function(err, result) {
        return callback(err);
    });
};
exports.delete_city = function(cityId, callback) {
    database.collection('cities').remove({_id: ObjectID(cityId)}, function(err, result) {
        return callback(err);
    });
};
exports.delete_competition = function(compId, callback) {
    database.collection('questions').remove({competition: compId}, function(err, result) {
        if(err) return callback(err);
        database.collection('slideshow').remove({competition: compId}, function(err, result) {
            if(err) return callback(err);
            database.collection('teams').remove({competition: compId}, function(err, result) {
                if(err) return callback(err);
                database.collection('competitions').remove({_id: ObjectID(compId)}, function(err, result) {
                    return callback(err);
                });
            });
        });
    });
};
exports.delete_team = function(teamId, callback){
    database.collection('teams').remove({_id: ObjectID(teamId)}, function(err, result) {
        return callback(err);
    });
};

