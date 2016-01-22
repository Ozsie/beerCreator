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
        if (data.public) {
            $scope.beer = data;
        }
    });
    
    $scope.downloadJSON = function() {
        var obj = {abv: $scope.beer.abv,
                   color: $scope.beer.color}
        var beer = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        var a = document.createElement('a');
        a.href = 'data:' + beer;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';
        a.click();
    };
}]);