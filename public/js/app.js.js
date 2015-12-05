var app = angular.module('meowApp', ['ngRoute', 'ngAnimate', 'ngResource']).run(function($rootScope, $http, $location){

	$rootScope.authenticated = false;
	$rootScope.cuttent_user = "";

	$rootScope.checkSession = function()
	{//checks user sesision

		$http.get('/success').success(function(data){

			if(data.user != null){
		        
		        $rootScope.authenticated = true;
		        $rootScope.current_user = data.user.username;
		        $rootScope.current_user_id = data.user._id;
		    }
		    else
		    {
		    
		        $rootScope.authenticated = false;
		        $rootScope.current_user = ""
	      	
	      	}

		});

	};

	$rootScope.signout = function(){
	//signs user out
		$http.get('/signout').success(function(){

			$rootScope.authenticated = false;
			$rootScope.cuttent_user = "";
			$rootScope.checkSession();

		});

		
	};


});

app.factory('postService', function($resource){
//restful api
	return $resource('/api/posts/:id', { id: '@_id' }, {
	
	    update: {
	  		
	  		method: 'PUT' // this method issues a PUT request
    
    	}

	});

});

app.config(function($routeProvider){
	$routeProvider
		//the main display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		//404 page
		.when('/404', {
			templateUrl: '404.html',
			controller: 'mainController'
		})
		//specific post
		.when('/reply/:id', {
			templateUrl: 'meow.html',
            controller: 'replyController'
        })
        //404 redirect
		.otherwise({ 
		
			redirectTo: '/404' 

		});
});

app.directive('toolbarTip', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function() {
            $('.modal-trigger').leanModal();
            $(document).ready(function() 
            {
   				
   				$('input#input_text, textarea#textarea1').characterCounter();
  			
  			});

        }
    };
});

app.controller('replyController', function($scope, $http, postService, $routeParams, $rootScope){
//controller for specific meow scope
	$scope.post = postService.get({id: $routeParams.id}, function(){
	//retrieves a single meow	
	});

	$rootScope.checkSession();//check session

	$scope.avatars = ['cat', 'yarn', 'paw', 'mouse', 'fish'];//avatars
	$scope.colors = ['red', 'blue', 'green', 'purple', 'pink', 'yellow', 'orange', 'grey'];//avtar colors
	$scope.text = '';//text variable
	$scope.is_op = false;//if user is original poster

	$scope.getColor = function(username)
	{//get the color for the reply

		for(var i = 0; i < $scope.post.reply_users.length; i++)
		{	

			if($scope.post.reply_users[i].user_name == username)
			{

				return $scope.post.reply_users[i].color;

			}

		}

	}

	$scope.getAvatar = function(username)
	{//get the avatar for the reply

		for(var i = 0; i < $scope.post.reply_users.length; i++)
		{	

			if($scope.post.reply_users[i].user_name == username)
			{

				return $scope.post.reply_users[i].avatar;

			}

		}

	}

	$scope.reply = function(){
	//called on reply
	$scope.checkAvatar = function(color, avatar){

		for(var a = 0; a < $scope.post.reply_users.length; a++)
		{//checks if avatar is in use in thread

			if(($scope.post.reply_users[a].color == color) && ($scope.post.reply_users[a].avatar == avatar))
			{


				return true;

			}
			else
			{



			}

		}

		return false;

	};

	$scope.current_avatar = '';
	$scope.current_color = '';
	$scope.userExists = false;

	$scope.avatarExists = true;
        
    if($scope.post.user_id == $rootScope.current_user_id)
	{//if user is the original poster

		$scope.is_op = true;

	}

	if($scope.post.replies.length > 0)
	{//if anyone has posted	

		for(var i = 0; i < $scope.post.reply_users.length; i++)
		{

			if($scope.post.reply_users[i].user_name == $rootScope.current_user)
			{//user has already posted in thread and has avatar assigned

				$scope.post.replies.push({
		
					text: $scope.text, 
					user_name: $rootScope.current_user, 
					created_at: Date.now, 
					votes: 0, 
					vote_users: []

				});

				$scope.userExists = true;

			}

		}

		if($scope.userExists == false)
		{//user has not posted in thread and needs an avatar

			if($scope.is_op != true)
			{//if user not thread op

				while($scope.avatarExists == true)
				{//get an avatar that has not been taken in thead
					
					$scope.current_color = $scope.colors[Math.floor(Math.random() * $scope.colors.length)];
					$scope.current_avatar = $scope.avatars[Math.floor(Math.random() * $scope.avatars.length)];
					$scope.avatarExists = $scope.checkAvatar($scope.current_color, $scope.current_avatar);

				}

				$scope.post.reply_users.push({//add user to thread users
			
				user_name: $rootScope.current_user, 
				color: $scope.current_color,
				avatar: $scope.current_avatar 

				});

			}
			else
			{

				$scope.post.reply_users.push({//add user to thread users
			
				user_name: $rootScope.current_user, 
				color: 'orange',
				avatar: 'op'

				});

			}

			$scope.post.replies.push({//add reply to thread
			
				text: $scope.text, 
				user_name: $rootScope.current_user, 
				created_at: Date.now, 
				votes: 0, 
				vote_users: []

			});

		}

		$scope.post.$update(function() {

			//updated in the backend
			$scope.post = postService.get({id: $routeParams.id}, function(){

				$('#modal1').closeModal();
				$scope.text = '';

			});	
		
		});



	}
	else
	{//no replies

		if($scope.is_op != true)
		{//if user not thread op

		
			$scope.current_color = $scope.colors[Math.floor(Math.random() * $scope.colors.length)];
			$scope.current_avatar = $scope.avatars[Math.floor(Math.random() * $scope.avatars.length)];

			$scope.post.reply_users.push({//add user to thread users
		
				user_name: $rootScope.current_user, 
				color: $scope.current_color,
				avatar: $scope.current_avatar 

			});

		}
		else
		{//user is op

			$scope.post.reply_users.push({//add user to thread users
			
				user_name: $rootScope.current_user, 
				color: 'orange',
				avatar: 'op'

			});

		}

		$scope.post.replies.push({//add reply to thread
		
			text: $scope.text, 
			user_name: $rootScope.current_user, 
			created_at: Date.now, 
			votes: 0, 
			vote_users: []

		});

		$scope.post.$update(function() {//update meow with new reply

			//updated in the backend
			$scope.post = postService.get({id: $routeParams.id}, function(){

				$('#modal1').closeModal();
				$scope.text = '';

			});	
		
		});

	}

	};

	$scope.checkVote = function(post){
	//update gui based on user vote 
		if(post.vote_users != null)
		{

			$scope.ifExists = false;


			for(var i = 0; i < post.vote_users.length; i++)
			{

				if(post.vote_users[i].user_name == $rootScope.current_user)
				{

					$scope.ifExists = true;

					if(post.vote_users[i].value == 1)
					{

						return 'pos';

					}
					else
					{	

						return 'neg';

					}	

				}

			}

			if($scope.ifExists == false)
			{

				return 'none';

			}

		}
		else
		{

			return 'none';

		}

	};

	$scope.checkReplyVote = function(reply){
	//update gui based on user vote
		if(reply.vote_users.length != 0)
		{

			$scope.ifExists2 = false;


			for(var i = 0; i < reply.vote_users.length; i++)
			{

				if(reply.vote_users[i].user_name == $rootScope.current_user)
				{

					$scope.ifExists2 = true;

					if(reply.vote_users[i].value == 1)
					{

						return 'pos';

					}
					else
					{	

						return 'neg';

					}	

				}

			}

			if($scope.ifExists2 == false)
			{

				return 'none';

			}

		}
		else
		{

			return 'none';

		}

	};

	$scope.up = function(id){
	//upvote
		$scope.entry = postService.get({id: id}, function(){

			$scope.ifExists = false;

			if($scope.entry.vote_users.length != 0)
			{//if anyone has voted 

				for(var i = 0; i < $scope.entry.vote_users.length; i++)
				{

					if($scope.entry.vote_users[i].user_name == $rootScope.current_user)
					{//if user has voted before

						if($scope.entry.vote_users[i].value == 1)
						{//user has already upvoted

							$scope.ifExists = true;

						}
						else
						{//user has downvoted and is now upvoting

							$scope.ifExists = true;
							$scope.entry.votes+= 2;

							
							$scope.entry.vote_users[i].value = 1;
							    

							$scope.entry.$update(function() {

								//updated in the backend
								$scope.post = postService.get({id: $routeParams.id}, function(){
		
								});	
							
							});

						}

					}

				}

				if($scope.ifExists == false)
				{//user has not voted before

					$scope.entry.votes++;
					$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: 1});
					    

					$scope.entry.$update(function() {//update reply

						//updated in the backend
						$scope.post = postService.get({id: $routeParams.id}, function(){
		
						});

					});

				}

			}
			else
			{//no votes 

				$scope.entry.votes++;

							
				$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: 1});
				    

				$scope.entry.$update(function() {

					//updated in the backend
					$scope.post = postService.get({id: $routeParams.id}, function(){
		
					});
					
				
				});


			}

		});

	};

	$scope.down = function(id){
	//downvote
		$scope.entry = postService.get({id: id}, function(){

			$scope.ifExists = false;

			if($scope.entry.vote_users.length != 0)
			{

				for(var i = 0; i < $scope.entry.vote_users.length; i++)
				{

					if($scope.entry.vote_users[i].user_name == $rootScope.current_user)
					{//if user has voted before

						if($scope.entry.vote_users[i].value == 1)
						{//user has upvoted and is not downvoting

							$scope.ifExists = true;
							$scope.entry.votes-= 2;
							$scope.entry.vote_users[i].value = -1;
							    

							$scope.entry.$update(function() {

								//updated in the backend
								$scope.post = postService.get({id: $routeParams.id}, function(){
		
								});
								
							
							});

						}
						else
						{//user had already downvoted 

							$scope.ifExists = true;

						}

					}

				}

				if($scope.ifExists == false)
				{//user has never voted before

					$scope.entry.votes--;
					$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: -1});
					    

					$scope.entry.$update(function() {

						//updated in the backend
						$scope.post = postService.get({id: $routeParams.id}, function(){
		
						});

					});

				}

			}
			else
			{//no votes 

				$scope.entry.votes--;

							
				$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: -1});
				    

				$scope.entry.$update(function() {

					//updated in the backend
					$scope.post = postService.get({id: $routeParams.id}, function(){
		
					});
					
				
				});


			}

		});

	};

	$scope.replyDown = function(post_id, id){
	//downvote reply
		$scope.entry = postService.get({id: post_id}, function(){

			for(var i = 0; i < $scope.post.replies.length; i++)
			{

				if($scope.post.replies[i]._id == id)
				{

					$scope.ifExists = false;

					if($scope.post.replies[i].vote_users.length != 0)
					{

						for(var a = 0; a < $scope.post.replies[i].vote_users.length; a++)
						{

							if($scope.post.replies[i].vote_users[a].user_name == $rootScope.current_user)
							{

								if($scope.post.replies[i].vote_users[a].value == 1)
								{

									$scope.ifExists = true;
									$scope.entry.replies[i].votes-= 2;
									$scope.entry.replies[i].vote_users[a].value = -1;
									    

									$scope.entry.$update(function() {

										//updated in the backend
										$scope.post = postService.get({id: $routeParams.id}, function(){
				
										});
										
									
									});

								}
								else
								{

									$scope.ifExists = true;

								}

							}

						}

						if($scope.ifExists == false)
						{

							$scope.entry.replies[i].votes--;
							$scope.entry.replies[i].vote_users.push({user_name: $rootScope.current_user, value: -1});
							    

							$scope.entry.$update(function() {

								//updated in the backend
								$scope.post = postService.get({id: $routeParams.id}, function(){
				
								});

							});

						}

					}
					else
					{

						$scope.entry.replies[i].votes--;

									
						$scope.entry.replies[i].vote_users.push({user_name: $rootScope.current_user, value: -1});
						    

						$scope.entry.$update(function() {

							//updated in the backend
							$scope.post = postService.get({id: $routeParams.id}, function(){
				
							});
							
						
						});


					}

				}
				else
				{

				}

			}

		});

	};

	$scope.replyUp = function(post_id, id){
	//downvote reply
		$scope.entry = postService.get({id: post_id}, function(){

			for(var i = 0; i < $scope.post.replies.length; i++)
			{

				if($scope.post.replies[i]._id == id)
				{

					$scope.ifExists = false;

					if($scope.post.replies[i].vote_users.length != 0)
					{

						for(var a = 0; a < $scope.post.replies[i].vote_users.length; a++)
						{

							if($scope.post.replies[i].vote_users[a].user_name == $rootScope.current_user)
							{

								if($scope.post.replies[i].vote_users[a].value == -1)
								{

									$scope.ifExists = true;
									$scope.entry.replies[i].votes+= 2;
									$scope.entry.replies[i].vote_users[a].value = 1;
									    

									$scope.entry.$update(function() {

										//updated in the backend
										$scope.post = postService.get({id: $routeParams.id}, function(){
				
										});
										
									
									});

								}
								else
								{

									$scope.ifExists = true;

								}

							}

						}

						if($scope.ifExists == false)
						{

							$scope.entry.replies[i].votes++;
							$scope.entry.replies[i].vote_users.push({user_name: $rootScope.current_user, value: 1});
							    

							$scope.entry.$update(function() {

								//updated in the backend
								$scope.post = postService.get({id: $routeParams.id}, function(){
				
								});

							});

						}

					}
					else
					{

						$scope.entry.replies[i].votes++;

									
						$scope.entry.replies[i].vote_users.push({user_name: $rootScope.current_user, value: 1});
						    

						$scope.entry.$update(function() {

							//updated in the backend
							$scope.post = postService.get({id: $routeParams.id}, function(){
				
							});
							
						
						});


					}

				}
				else
				{

				}

			}

		});

	};


});

app.controller('mainController', function($scope, $http, postService, $rootScope){
//controller for home page view scope
	$scope.posts = postService.query(); 
	$scope.newPost = {text: '', created_at: ''};

	$rootScope.checkSession();//check session

	$scope.post = function(){
	//post click handler
		$scope.newPost.created_at = Date.now(); 
		
		postService.save($scope.newPost, function(){
		//save to backend 
			$scope.posts = postService.query();
			$scope.newPost = {text: '', created_at: ''};
			$('#modal1').closeModal();

		});

	};

	$scope.checkVote = function(post){
	//checks user vote to update gui
		if(post.vote_users.length != 0)
		{

			$scope.ifExists = false;


			for(var i = 0; i < post.vote_users.length; i++)
			{

				if(post.vote_users[i].user_name == $rootScope.current_user)
				{

					$scope.ifExists = true;

					if(post.vote_users[i].value == 1)
					{

						return 'pos';

					}
					else
					{	

						return 'neg';

					}	

				}

			}

			if($scope.ifExists == false)
			{

				return 'none';

			}

		}
		else
		{

			return 'none';

		}




	};

	$scope.up = function(id){
	//upvote
		$scope.entry = postService.get({id: id}, function(){

			$scope.ifExists = false;

			if($scope.entry.vote_users.length != 0)
			{

				for(var i = 0; i < $scope.entry.vote_users.length; i++)
				{

					if($scope.entry.vote_users[i].user_name == $rootScope.current_user)
					{

						if($scope.entry.vote_users[i].value == 1)
						{

							$scope.ifExists = true;

						}
						else
						{

							$scope.ifExists = true;
							$scope.entry.votes+= 2;

							
							$scope.entry.vote_users[i].value = 1;
							    

							$scope.entry.$update(function() {

								//updated in the backend
								postService.query().$promise.then(function(data) {
									
									$scope.posts = data;
									

								});
								
							
							});

						}

					}

				}

				if($scope.ifExists == false)
				{

					$scope.entry.votes++;
					$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: 1});
					    

					$scope.entry.$update(function() {

						//updated in the backend
						postService.query().$promise.then(function(data) {
						
							$scope.posts = data;

						});

					});

				}

			}
			else
			{

				$scope.entry.votes++;

							
				$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: 1});
				    

				$scope.entry.$update(function() {

					//updated in the backend
					postService.query().$promise.then(function(data) {
						
						$scope.posts = data;

					});
					
				
				});


			}

		});

	}

	$scope.down = function(id){
	//downvote
		$scope.entry = postService.get({id: id}, function(){

			$scope.ifExists = false;

			if($scope.entry.vote_users.length != 0)
			{

				for(var i = 0; i < $scope.entry.vote_users.length; i++)
				{

					if($scope.entry.vote_users[i].user_name == $rootScope.current_user)
					{

						if($scope.entry.vote_users[i].value == 1)
						{

							$scope.ifExists = true;
							$scope.entry.votes-= 2;
							$scope.entry.vote_users[i].value = -1;
							    

							$scope.entry.$update(function() {

								//updated in the backend
								postService.query().$promise.then(function(data) {
    							
    								$scope.posts = data;


    							});
								
							
							});

						}
						else
						{

							$scope.ifExists = true;

						}

					}

				}

				if($scope.ifExists == false)
				{

					$scope.entry.votes--;
					$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: -1});
					    

					$scope.entry.$update(function() {

						//updated in the backend
						postService.query().$promise.then(function(data) {
						
							$scope.posts = data;

						});

					});

				}

			}
			else
			{

				$scope.entry.votes--;

							
				$scope.entry.vote_users.push({user_name: $rootScope.current_user, value: -1});
				    

				$scope.entry.$update(function() {

					//updated in the backend
					postService.query().$promise.then(function(data) {
					
						$scope.posts = data;

					});
					
				
				});


			}

		});

	}


});

app.controller('authController', function($scope, $rootScope, $http, $location){
//authentication controller
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	if($rootScope.authenticated == true)
	{//route home page if already authenticated 

		$location.path('/');

	}	

	$scope.login = function()
	{//login handler

		$http.post('/login', $scope.user).success(function(data){

			if(data.state == 'success'){
		        
		        $rootScope.authenticated = true;
		        $rootScope.current_user = data.user.username;
		        $location.path('/');
		    }
		    else
		    {
		    
		        $scope.error_message = data.message;
	      	
	      	}

		});

	};

	$scope.register = function()
	{//register handler

		$http.post('/signup', $scope.user).success(function(data){

			if(data.state == 'success'){
		        
		        $rootScope.authenticated = true;
		        $rootScope.current_user = data.user.username;
		        $location.path('/');
		    }
		    else
		    {
		    
		        $scope.error_message = data.message;
	      	
	      	}

		});

	};

});

