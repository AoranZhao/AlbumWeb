var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/mongotest');
mongoose.connection.on('open', function() {
	console.log('Mongoose connected.');
});

var Account = new Schema({
	username: { type: String, required: true },
	date_created: { type: Date, default: Date.now },
	visits: { type: Number, default: 0 },
	active: { type: Boolean, default: false },
	age: { type: Number, required: true, min: 13, max: 20 }
});

Account.statics.findByAgeRange = function(min, max, callback) {
	this.find({age: {$gt: min, $lt: max}}, callback);
}

var AccountModel = mongoose.model('Account', Account);

AccountModel.findByAgeRange(18, 30, function(err, accounts) {
	console.log(accounts.length);
	mongoose.connection.close();
})
// var newUser = new AccountModel({
// 	username: 'randomUser'
// });
// newUser.save();
// console.log(newUser.username);
// console.log(newUser.date_created);
// console.log(newUser.visits);
// console.log(newUser.active);

// AccountModel.find({age: {$gt: 18, $lt: 30}}, function(err, accounts) {
// 	console.log(accounts.length);
// 	console.log(accounts[0].username);
// 	mongoose.connection.close();
// });
