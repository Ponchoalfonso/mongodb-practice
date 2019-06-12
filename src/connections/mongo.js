const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const schemaToJson = require('../schemaToJson');

const mysqlToMongo = () => {
  const url = 'mongodb://172.17.0.1:27017';
  const dbName = 'cpremier';
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    schemaToJson(client, db);
  });
}; module.exports = mysqlToMongo;