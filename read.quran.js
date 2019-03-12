const fs = require('fs');
const config = require('./common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

const data = [];
const lineList = fs.readFileSync('./quran.txt').toString().split('\n');
lineList.forEach((line) => {
    const _tmp1 = line.split('|');
    data.push({
        religion: 'quran',
        book: 'quran',
        pos: _tmp1[0] + '|' + _tmp1[1],
        text: _tmp1[2]
    });
});

mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const bibleCollection = db.collection('bible');
    bibleCollection.insertMany(
        data
        , function (err, result) {
            if (err === null) {
                const setttingsCollection = db.collection('settings');
                setttingsCollection.find({'key': 'update'}).toArray(function (err, docs) {
                    if (docs.length === 0) {
                        setttingsCollection.insertMany([
                            {key: 'update', value: new Date().getTime().toString()}
                        ], function (insertErr, result) {
                            console.log(insertErr);
                            process.exit(0);
                        });
                    } else {
                        setttingsCollection.updateOne(docs[0], {$set: {value: new Date().getTime().toString()}}, function (updateErr, result) {
                            console.log(updateErr);
                            process.exit(0);
                        });
                    }
                });
            } else {
                console.log(err);
            }
        });
});

