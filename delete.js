const fs = require('fs');
const config = require('./common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const bibleCollection = db.collection('bible');
    const wordsCollection = db.collection('words');
    bibleCollection.drop(function (err, delOK) {
        wordsCollection.drop(function (err, delOK) {
            process.exit(0);
        });
    });
});

