const exit = (__message, __exit = true) => {
    console.log('-------------------------');
    console.log('-------------------------');
    console.log(__message);
    console.log('-------------------------');
    console.log('-------------------------');
    if (__exit) {
        process.exit(-1);
    }
}


module.exports = {
    exit
};
