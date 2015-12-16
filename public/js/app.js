var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngFileUpload', 'ngImgCrop']).run(function($rootScope, $http, $location){

//rootscope

});



app.config(function($routeProvider){
	$routeProvider
		//the timeline display
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
		.when('/404', {
			templateUrl: '404.html',
			controller: 'mainController'
		})
		.when('/reply/:id', {
			templateUrl: 'meow.html',
            controller: 'replyController'
        })
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
            //dom alterations

        }
    };
});


app.controller('mainController', function($scope, $http, $rootScope, Upload, $location){

	$scope.ab;
	$scope.TgG;
	$scope.Ta;

	$scope.calculate = function(dataUrl, imgUrl){
		
		$scope.upload = function(dataUrl){
	        Upload.upload({
	            url: '/api/posts',
	            method: 'POST',
	            file: Upload.dataUrltoBlob(dataUrl)//convert to file object
	        }).success(function(data, status, headers, config) {

	        	//do something data
	        	//we can redirect here
	           
	        }).error(function(err){

	            console.log('Error uploading file: ' + err.message || err);
	        
	        });
	        
		}

		//run upload
		$scope.upload(dataUrl);

	};
	


});


