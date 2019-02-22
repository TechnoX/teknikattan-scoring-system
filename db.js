var MongoClient = require('mongodb').MongoClient

var database;
MongoClient.connect('mongodb://localhost:27017/', function (err, db) {
    if (err) throw err
    database = db.db('teknikattan');
    database.collection('questions').find().toArray(function(err, result) {
        if (err) throw err;
        questions = result;
    });
})


exports.replace_questions = function(new_questions, callback) {
    database.collection('questions').remove({}, function(err, result) {
        if (err) return console.log(err);
        console.log('removed everything:');
        
        database.collection('questions').insertMany(new_questions, function(err, result) {
            if (err) callback(err);
            else {
                console.log('saved data to database:');
                console.log(result);
            }
        });
    });
};

exports.get_questions = function(callback) {
    database.collection('questions').find().toArray(function(err, result) {
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
