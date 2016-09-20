'use strict';

// Declare app level module which depends on views, and components
angular.module('beerCreator', [
  'firebase',
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
config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
  //$compileProvider.debugInfoEnabled(false);
}])

.controller('MainCtrl' ,['$scope', 'Page', function($scope, Page) {
    $scope.Page = Page;
}]);