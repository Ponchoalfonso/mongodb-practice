const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://172.17.0.1:27017';
const dbName = 'cpremier';
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // Query 1
  db.collection('employees').count().then((total) => console.log('Query 1\n',total));
  
  // Query 2
  db.collection('employees').find({job: 'Electricista'}).toArray().then((values) => console.log('\nQuery 2\n', values));

  // Query 3
  db.collection('employees').distinct('job').then((jobs) => console.log('\nQuery 3\n', jobs));;

  // Query 4
  db.collection('employees').find({
    "assignments.start_date": { "$gte": new Date("2016-11-01"), "$lte": new Date("2016-11-30") }
  }).toArray().then((values) => console.log('\nQuery 4\n', values));

  // Query 5
  db.collection('employees').findOne({'id': 1311}).then((value) => console.log('\nQuery 5\n', value));

  client.close();
});
