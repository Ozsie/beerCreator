'use strict';

// Declare app level module which depends on views, and components
angular.module('beerCreator', [
  'ngMaterial',
  'ngRoute',
  'beerCreator.beerList',
  'beerCreator.ingredients',
  'beerCreator.editBeer',
  'beerCreator.profiles',
  'beerCreator.services',
  'beerCreator.directives',
  'beerCreator.filters',
  'beerCreator.login',
  'beerCreator.public'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}])

.controller('MainCtrl' ,['$scope', 'Page', function($scope, Page) {
    $scope.Page = Page;
}]);