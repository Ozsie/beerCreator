'use strict';

angular.module('beerCreator.stock', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stock', {
    templateUrl: 'stock/stock.html',
    controller: 'StockCtrl'
  });
}])

.controller('StockCtrl', ['$scope', 'User', function($scope, User) {
    $scope.user = User;
}]);