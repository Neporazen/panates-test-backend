const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

const mongoUri = 'mongodb+srv://dbUser:dbPassword@cluster0-6ehlt.mongodb.net/?ssl=true&authSource=admin';
const dbName = 'sample_airbnb';
const collectionName = 'listingsAndReviews';

module.exports = async () => {
    try{
        const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true });
        const col = client.db(dbName).collection(collectionName);
        // const response = await col.findOne({
        //     _id: '10084023',
        // });
        // console.log(response.name);
        return col;
    } catch (err) {
        console.log(err.stack); 
        return null;
    }
};

