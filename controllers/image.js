var fs = require('fs'),
	path = require('path'),
	sidebar = require('../helpers/sidebar'),
	Models = require('../models'),
	md5 = require('MD5');

module.exports = {
	index: function(req, res) {
		// res.send('The image: index controller ' + req.params.image_id);
		var viewModel = {
			image: {},
			comments: []
		}

		Models.Image.findOne({ filename: {$regex: req.params.image_id} }, function(err, image) {
			if (err) throw err;
			if (image) {
				image.views = image.views + 1;
				viewModel.image = image;
				image.save();

				Models.Comment.find({ image_id: image._id }, {}, {sort: {timestamp: 1}}, function(err, comments) {
					if (err) throw err;

					viewModel.comments = comments;

					sidebar(viewModel, function(viewModel) {
						res.render('image', viewModel);
					})
				})
			} else {
				res.redirect('/');
			}
		})

		// sidebar(viewModel, function(viewModel) {
		// 	res.render('image', viewModel);
		// });
	},
	create: function(req, res) {
		// res.send('The image:create POST controller');
		var saveImage = function() {
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
				imgUrl = '';
			for (var i = 0; i < 6; i++) {
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			Models.Image.find({ filename: imgUrl }, function(err, images) {
				if (images.length > 0) {
					saveImage();
				} else {
					var tempPath = req.file.path,
						ext = path.extname(req.file.originalname).toLowerCase(),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					if (ext == '.png' || ext == '.jpg' || ext == '.jpeg' || ext == '.gif') {
						fs.rename(tempPath, targetPath, function(err) {
							if (err) throw err;

							var newImg = new Models.Image({
								title: req.body.title,
								filename: imgUrl + ext,
								description: req.body.description
							})
							newImg.save(function(err, image) {
								res.redirect('/images/' + image.uniqueId);
							})

							// res.redirect('/images/' + imgUrl);
						});
					} else {
						fs.unlike(tempPath, function() {
							if (err) throw err;
							res.json(500, {err: 'Only image files are allowed.'});
						})
					}
				}
			})
		}
		saveImage();
	},
	like: function(req, res) {
		// res.json({likes: 1});
		// res.send('The image:like POST controller');
		Models.Image.findOne({filename: {$regex: req.params.image_id}}, function(err, image) {
			if (err) throw err;
			if (image) {
				image.likes = image.likes + 1;
				image.save(function(err) {
					if (err) throw err;
					res.json({likes: image.likes});
				})
			}
		})
	},
	comment: function(req, res) {
		// res.send('The image:comment POST controller');
		Models.Image.findOne({filename: {$regex: req.params.image_id}}, function(err, image) {
			if (err) throw err;
			if (image) {
				var newComment = new Models.Comment(req.body);
				newComment.gravatar = md5(newComment.email);
				newComment.image_id = image._id;
				newComment.save(function(err, comment) {
					if (err) throw err;
					res.redirect('/images/' + image.uniqueId + '#' + comment._id);
				})
			} else {
				res.redirect('/');
			}
		})
	},
	remove: function(req, res) {
		Models.Image.findOne({ filename: {$regex: req.params.image_id}}, function(err, image) {
			if (err) throw err;
			console.log('image:', image);
			fs.unlink(path.resolve('./public/upload/' + image.filename), function(err) {
				if (err) throw err;

				Models.Comment.remove({image_id: image._id}, function(err) {
					image.remove(function(err) {
						if (err) throw err;
						res.json(true);
					})
				})
			})
		})
	}
}