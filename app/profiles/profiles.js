'use strict';

angular.module('beerCreator.profiles', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profiles', {
    templateUrl: 'profiles/profiles.html',
    controller: 'ProfilesCtrl'
  });
}])

.controller('ProfilesCtrl', ['$scope', 'Profiles', function($scope, Profiles) {
    Profiles.equipment().query({}, function(equipment) {
        $scope.equipment = equipment;
    });
    
    Profiles.fermentationProfiles().query({}, function(fermentationProfiles) {
        $scope.fermentationProfiles = fermentationProfiles;
    });
    
    Profiles.mashProfiles().query({}, function(mashProfiles) {
        $scope.mashProfiles = mashProfiles;
    });
}]);