var models = require('../models');
var async = require('async');

module.exports = function(callback) {
	async.parallel([
		function(next) {
			models.Image.count({}, function(err, total) {
				if (err) throw err;
				next(null, total);
			})
		},
		function(next) {
			models.Comment.count({}, function(err, total) {
				if (err) throw err;
				next(null, total);
			});
			// models.Comments.count({}, next);
		},
		function(next) {
			models.Image.aggregate({$group: {_id: '1', viewsTotal: {$sum: '$views'}}}, function(err, result) {
				var viewsTotal = 0;
				if (result.length > 0) {
					viewsTotal += result[0].viewsTotal;
				}
				next(null, viewsTotal);
			})
		},
		function(next) {
			models.Image.aggregate({$group: {_id: '1', likesTotal: {$sum: '$likes'}}}, function(err, result) {
				var likesTotal = 0;
				if (result.length > 0) {
					likesTotal += result[0].likesTotal;
				}
				next(null, likesTotal);
			})
		}],
		function(err, results) {
			var stats = {
				images: results[0],
				comments: results[1],
				views: results[2],
				likes: results[3]
			}
			callback(null, stats);
		})

	// return stats;
}