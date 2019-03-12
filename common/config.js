const util = require('./util');

const fs = require('fs');
const ROOT = process.cwd() + '/';
const config = () => {
    if (fs.existsSync(ROOT + 'config.json')) {
        return require(ROOT + 'config.json');
    } else {
        const _config = require(ROOT + 'config.example.json');
        _config.port = getParam('PORT');
        _config.mongo_server = getParam('MONGOSERVER');
        _config.mongo_database = getParam('MONGODATABASE');
        Object.keys(_config).forEach((_configName) => {
            if (_config[_configName] === '') {

                util.exit('Config ERROR >>>> ' + _configName);
            }
        });
        return _config;
    }
}

const getParam = (__name, __default = '') => {
    let __return = __default;
    if (process.env[__name] !== undefined) {
        __return = process.env[__name];
    }
    return __return;
}

module.exports = config();
