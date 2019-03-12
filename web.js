const config = require('./common/config');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.set('port', config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    res.send({data: 'hello backend world'});
});

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(config.mongo_server, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    const db = client.db(config.mongo_database);
    const bibleCollection = db.collection('bible');
    const wordsCollection = db.collection('words');
    const settingsCollection = db.collection('settings');

    app.get('/list/', function (req, res) {
        if (fs.existsSync('.data/list.json')) {
            res.sendFile('.data/list.json', {root: './'}, function (err) {
            });
        } else {
            bibleCollection.find().toArray(function (err, bibleList) {
                res.json(bibleList);
            });
        }
    });

    app.get('/find/:text', function (req, res) {
        bibleCollection.find({"text": {$regex: req.params.text, $options: "$i"}}).toArray(function (err, bibleList) {
            res.json(bibleList);
        });

    });

    app.get('/words/', function (req, res) {
        if (fs.existsSync('.data/words.json')) {
            res.sendFile('.data/words.json', {root: './'}, function (err) {
            });
        } else {
            wordsCollection.find().toArray(function (err, bibleList) {
                const out = [];
                bibleList.forEach((a) => {
                    const _a = {...a};
                    out.push({
                        w: _a.word,
                        r: _a.recordsoptim
                    });
                });
                res.json(out);
            });
        }
    });


    app.get('/update/', function (req, res) {
        if (fs.existsSync('.data/settings.json')) {
            res.sendFile('.data/settings.json', {root: './'}, function (err) {
            });
        } else {
            settingsCollection.find({'key': 'update'}).toArray(function (err, settingsList) {
                res.json(settingsList[0]);
            });
        }
    });

    app.listen(app.get('port'), function () {
        console.log('running on port', app.get('port'))
    })
});
