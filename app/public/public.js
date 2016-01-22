'use strict';

angular.module('beerCreator.public', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/public/:userId/:beerId', {
    templateUrl: 'public/public.html',
    controller: 'PublicCtrl'
  });
}])

.controller('PublicCtrl', ['$scope', '$firebaseObject', '$routeParams', function($scope, $firebaseObject, $routeParams) {
    $scope.userId = $routeParams.userId;
    $scope.beerId = $routeParams.beerId;
    var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/beerlist/" + $scope.userId + "/" + $scope.beerId);

    var obj = $firebaseObject(ref);

    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function(data) {
        console.log("loaded record:", obj.$id, obj.someOtherKeyInData);
        $scope.beer = data;
    });
}]);