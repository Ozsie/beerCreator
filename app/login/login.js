'use strict';

angular.module('beerCreator.login', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$firebaseAuth', '$location', 'User', function($scope, $firebaseAuth, $location, User) {
    var ref = new Firebase("https://luminous-heat-8761.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);
        
    $scope.login = function() {
        $scope.authObj.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        }).then(function(authData) {
            User.login(authData);
            $location.path('beerList');
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    };
    
    $scope.googleLogin = function() {
        ref.authWithOAuthPopup("google", function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
            } else {
              console.log("Authenticated successfully with payload:", authData);
              User.login(authData);
              $location.path('beerList');
            }
        });
    };
}]);