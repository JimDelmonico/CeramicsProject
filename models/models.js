var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	username: String, 
	password: String, //hash created from password 
	created_at: {type: Date, default: Date.now} 

});

var userSchema2 = new mongoose.Schema({

	username: String, 
	password: String, //hash created from password 
	name: String,
	sex: String,
	major: String,
	year: String,
	if_instructor: Boolean, 
	enrolled_classes: [{

		class_id: mongoose.Schema.Types.ObjectId,
		class_name: String,
		current_grade: Number

	}], 
	created_at: {type: Date, default: Date.now} 

});

var classSchema = new mongoose.Schema({

	name: String,
	instructor_id: mongoose.Schema.Types.ObjectId,
	assignments: [{ 
	
		average: Number, 
		user_name: String, 
		created_at: {type: Date, default: Date.now}, 
		comments: [{ 
			
			user_id: mongoose.Schema.Types.ObjectId,
			user_name: String, 
			text: String,
			created_at: {type: Date, default: Date.now}
		
		}] 

	}], 
	enrolled_students: [{ 
		
		user_id: mongoose.Schema.Types.ObjectId,
		user_name: String

	}], 
	created_at: {type: Date, default: Date.now} 

});


var meowSchema = new mongoose.Schema({

	text: String,
	user_id: mongoose.Schema.Types.ObjectId,
	replies: [{ 
	
		text: String, 
		user_name: String, 
		created_at: {type: Date, default: Date.now}, 
		votes: Number,
		vote_users: [{ 
	
		user_name: String, 
		value: Number
		
		}] 

	}], 
	reply_users: [{ 
	
		user_name: String, 
		color: String, 
		avatar: String 

	}], 
	votes: {type: Number, default: 0},
	vote_users: [{ 
	
		user_name: String, 
		value: Number

	}], 
	created_at: {type: Date, default: Date.now} 

});


//declare a model called 'User' which has schema userSchema
 mongoose.model("User", userSchema);

 //declare a model called 'Meow' which has schema meowSchema
 mongoose.model("Meow", meowSchema);