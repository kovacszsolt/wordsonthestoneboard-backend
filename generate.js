const fs = require('fs');
const config = require('./common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const bibleCollection = db.collection('bible');
    const wordsCollection = db.collection('words');
    const settingsCollection = db.collection('settings');




    settingsCollection.find({'key': 'update'}).toArray(function (err, settingsList) {
        const data = JSON.stringify(settingsList[0]);
        fs.writeFileSync('.data/settings.json', data);
        console.log('settings OK');
    });

    bibleCollection.find().toArray(function (err, bibleList) {
        const out = [];
        bibleList.forEach((a) => {
            const _a={...a};
            out.push({
                _id: a._id,
                r: _a.religion,
                b: _a.book,
                t: _a.text
            });
        });
        const data = JSON.stringify(out);
        fs.writeFileSync('.data/list.json', data);
        /*
        const data = JSON.stringify(bibleList);
        fs.writeFileSync('.data/list.json', data);
        */
        console.log('list OK');
    });

    wordsCollection.find().toArray(function (err, bibleList) {
        const out = [];
        bibleList.forEach((a) => {
            const _a={...a};
            out.push({
                w: _a.word,
                r: _a.recordsoptim
            });
        });
        const data = JSON.stringify(out);
        fs.writeFileSync('.data/words.json', data);
        console.log('Words OK');
        mongoClient.close()
    });
});
