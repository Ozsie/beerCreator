'use strict';

// Declare app level module which depends on views, and components
angular.module('beerCreator', [
  'ngRoute',
  'beerCreator.beerList',
  'beerCreator.stock',
  'beerCreator.ingredients',
  'beerCreator.editBeer',
  'beerCreator.profiles',
  'beerCreator.services',
  'beerCreator.filters',
  'beerCreator.login'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
