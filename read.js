const fs = require('fs');
const config = require('./common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

const data = [];
const lineList = fs.readFileSync('./bible.txt').toString().split('\n');
lineList.forEach((line) => {
    const _tmp1 = line.split('\t');
    const text = _tmp1[1].replace('\r', '');
    const _tmp2 = _tmp1[0].split(' ');
    const book = _tmp2[0];
    const pos = _tmp2[1];
    data.push({
        religion: 'christian',
        book: book,
        pos: pos,
        text: text
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

