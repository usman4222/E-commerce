const mongoose = require('mongoose');

const dataBase = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((data) => {
            console.log(`Mongo is connected.. ${data.connection.host}`);
        })
}

module.exports = dataBase;
