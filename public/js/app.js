var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngFileUpload', 'ngImgCrop']).run(function($rootScope, $http, $location){



	$rootScope.anything = "Play with the rootscope";


});



app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		.when('/404', {
			templateUrl: '404.html',
			controller: 'mainController'
		})
		.otherwise({ 
		
			redirectTo: '/404' 

		});
});


app.directive('modal', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function() {
            
            //materilaize dom initializing functions
  			
        }
    };
});



app.controller('mainController', function($scope, $http, postService, $rootScope, $location){

	$('.button-collapse').sideNav('hide');
	$scope.newPost = {text: '', created_at: ''};

});

app.controller('authController', function($scope, $rootScope, $http, $location, Upload){

	//example of image upload in here

	$('.button-collapse').sideNav('hide');//hides nav

	$scope.firstname = '';
	$scope.lastname = '';

	$scope.user = {username: '', password: '', name: '', major: 'Computer Science', sex: 'Male', year: 'Freshman', url: ""};//defaults
	$scope.error_message = '';
	

	$scope.login = function()
	{//login



	};

	

	$scope.register = function(dataUrl, imgUrl)
	{//register user

		$scope.user.name = $scope.firstname + " " + $scope.lastname;
		$scope.user.url= "images/user_pictures/" + imgUrl.name;
		
		$scope.upload = function (dataUrl) {//right hurrr
	        Upload.upload({
                url: '/upload/image',
                method: 'POST',
                file: Upload.dataUrltoBlob(dataUrl)//convert to file object
            }).success(function(data, status, headers, config) {
               
            }).error(function(err) {

                console.log('Error uploading file: ' + err.message || err);
            });
	        
		}

	};

});