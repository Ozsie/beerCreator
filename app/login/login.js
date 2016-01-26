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
    
    $scope.login = function(provider) {
        $scope.authObj.$authWithOAuthPopup(provider).then(function(authData) {
            var loginLogRef = new Firebase("https://luminous-heat-8761.firebaseio.com/loginLog/");
            var loginLog = $firebaseArray(loginLogRef);
            
            User.login(authData);
            $location.path('beerList');
            loginLog.$add({uid: authData.uid, displayName: authData[provider].displayName, time: Firebase.ServerValue.TIMESTAMP});
            if (loginLog.length > 50) {
                loginLog.$remove(0);
            }
        }).catch(function(error) {
            console.log("Login Failed!", error);
        });
    };
}]);