var express = require('express');
var router = express.Router();

/* GET home page. */


router.use('/posts');

router.route('/posts')
	
	//returns all posts
	.post(function(req, res){
		
		//do stuff

		return;

	})

	.get(function(req, res){

		//do stuff

	});


module.exports = router;
