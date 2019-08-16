const mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGO_URL || 'mongodb://localhost/api-base',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);

mongoose.Promise = global.Promise;

module.exports = mongoose;