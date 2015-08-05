'use strict';

// Declare app level module which depends on views, and components
angular.module('beerCreator', [
  'ngRoute',
  'beerCreator.beerList',
  'beerCreator.stock',
  'beerCreator.ingredients',
  'beerCreator.services',
  'beerCreator.filters'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/beerList'});
}]);
