'use strict';

angular.module('beerCreator.login', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$firebaseAuth', '$firebaseArray', '$location', 'User', function($scope, $firebaseAuth, $firebaseArray, $location, User) {
    var ref = new Firebase("https://luminous-heat-8761.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);
    
    var loginLogRef = new Firebase("https://luminous-heat-8761.firebaseio.com/loginLog/");

    $scope.loginLog = $firebaseArray(loginLogRef);
        
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
        $scope.authObj.$authWithOAuthPopup("google").then(function(authData) {
            User.login(authData);
            $location.path('beerList');
            $scope.loginLog.$add({uid: authData.uid, displayName: authData.google.displayName, time: Firebase.ServerValue.TIMESTAMP});
            if ($scope.loginLog.length > 50) {
                $scope.loginLog.$remove(0);
            }
        }).catch(function(error) {
            console.log("Login Failed!", error);
        });
    };
}]);