'use strict';

angular.module('beerCreator.login', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$rootScope', '$scope', '$firebaseAuth', '$firebaseArray', '$firebaseObject', '$location', 'User', function($rootScope, $scope, $firebaseAuth, $firebaseArray, $firebaseObject, $location, User) {
    $scope.authObj = $firebaseAuth();
        
    $scope.login = function() {
        $scope.authObj.signInWithEmailAndPassword($scope.email,$scope.password).then(function(authData) {
            User.login(authData);
            $location.path('beerList');
        }).catch(function(error) {
            console.error("Authentication failed:", error);
        });
    };
    
    $scope.login = function(provider) {
        $scope.authObj.$signInWithPopup(provider).then(function(authData) {
            var ref = firebase.database().ref();
            var loginLog = $firebaseArray(ref.child('loginLog'));
            
            loginLog.$loaded().then(function (data){ 
                loginLog.$add({uid: authData.user.uid, displayName: authData.user.providerData[0].displayName, time: Date.now()});
                if (loginLog.length > 50) {
                    loginLog.$remove(0);
                }
            });


            var user = $firebaseObject(ref.child('users/' + authData.user.uid));
            
            user.$loaded().then(function (data) {
                var userBase = $firebaseObject(ref.child('userbase'));
                userBase.$loaded().then(function (baseData) {
                    if (!data.$value && !data.displayName && !data.settings) {
                        var displayName = authData.user.providerData[0].displayName;
                        if (!displayName) {
                            displayName = authData.user.providerData[0].username;
                        }
                        var settings = angular.copy(baseData);
                        for (var obj in settings) {
                            if (obj.startsWith('$')) {
                                delete settings[obj];
                            }
                        }
                        data.$value = {displayName: displayName, settings: settings};
                    } else if (!data.settings) {
                        data.settings = angular.copy(baseData);
                    } else if (!data.displayName) {
                        var displayName = authData.user.providerData[0].displayName;
                        if (!displayName) {
                            displayName = authData.user.providerData[0].username;
                        }
                        data.displayName = displayName;
                    }
                    data.$save();

                    User.login(authData.user, data);
                    $location.path('beerList');
                });
            });
            
        }).catch(function(error) {
            console.log("Login Failed!", error);
        });
    };
}]);