const config = require('./common/config');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});

mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const bibleCollection = db.collection('bible');
    const wordsCollection = db.collection('words');
    bibleCollection.find().toArray(function (err, bibleList) {
        const newRecords = [];
        let recordPos = bibleList.length;
        bibleList.forEach((bibleRecord) => {
            recordPos--;
            let text = (bibleRecord.text === null) ? '' : bibleRecord.text;
            //console.log(text);
            text = text.replace('(', '');
            text = text.replace(')', '');
            text = text.replace(':', '');
            text = text.replace('"', '');
            text = text.replace(',', '');
            text = text.replace('.', '');
            text = text.replace('?', '');
            text = text.replace('-', '');
            text = text.replace('!', '');
            text = text.toLowerCase();
            const words = text.split(' ');
            words.forEach((_word) => {
                const _find = newRecords.find(a => a.word === _word);
                if (_find === undefined) {
                    const _tmp = [];
                    const _tmpMin = [];
                    const _tmpOptim = [];
                    _tmp.push((bibleRecord));
                    _tmpMin.push(({
                        r: bibleRecord.religion,
                        t: bibleRecord.text
                    }));
                    _tmpOptim.push(({
                        i: bibleRecord._id,
                    }));
                    newRecords.push({
                        word: _word,
                        records: _tmp,
                        recordsmin: _tmpMin,
                        recordsoptim: _tmpOptim
                    });
                } else {
                    if (_find.records.find(a => a._id === bibleRecord._id) === undefined) {
                        _find.records.push(bibleRecord);
                        _find.recordsmin.push({
                            r: bibleRecord.religion,
                            t: bibleRecord.text
                        });
                        _find.recordsoptim.push({
                            i: bibleRecord._id
                        });
                    }
                }
            });
            if (recordPos / 1000 === Math.ceil(recordPos / 1000)) {
                console.log(recordPos);
            }
        });
        wordsCollection.insertMany(
            newRecords
            , function (err, result) {
                if (err === null) {
                    console.log('ok');
                } else {
                    console.log(err);
                }
            });
    });
});
