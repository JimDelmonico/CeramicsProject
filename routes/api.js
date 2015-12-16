var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');

router.route('/posts')
	
	//returns all posts
	.post(function(req, res){

		
		var form = new multiparty.Form();
	    
	    form.parse(req, function(err, fields, files) {
	        
	        var file = files.file[0];
	        var contentType = file.headers['content-type'];
	        var tmpPath = file.path;


	        //console.log(JSON.stringify(file)); 

	        // Server side file type checker.
	        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
	            fs.unlink(tmpPath);
	            return res.status(400).send('Unsupported file type.');
	        }

	        //computations here
	        //Sarah:

	        return res.json("Json Here");

	    });

		

	})

	.get(function(req, res){

		return res.send("data");

	});


module.exports = router;
