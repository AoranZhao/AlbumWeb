var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mongotest', function(err, db) {
	console.log('Connected to MongoDB');

	// using the db connection object, save the collection 'testing' to a seperate variable;
	var collection = db.collection('testing');

	// insert a new item using the collection's insert function
	collection.insert({'title': 'Snowcrash'}, function(err, docs) {
		// on successful insertion, log to the screen the new collection's details
		console.log(docs.ops.length + ' record inserted.');
		console.log(docs.ops[0].title + ' - ' + docs.ops[0]._id);
	});

	collection.findOne({title: 'Snowcrash'}, function(err, doc) {
		console.log(doc._id + ' - ' + doc.title);
		db.close();
	})
})