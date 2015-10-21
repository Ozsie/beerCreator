'use strict';

angular.module('beerCreator.profiles', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profiles', {
    templateUrl: 'profiles/profiles.html',
    controller: 'ProfilesCtrl'
  });
}])

.controller('ProfilesCtrl', ['$scope', 'Profiles', function($scope, Profiles) {
    Profiles.equipment().$loaded().then(function(equipment) {
        $scope.equipmentList = equipment;
    });

    Profiles.fermentationProfiles().$loaded().then(function(fermentationProfiles) {
        $scope.fermentationProfiles = fermentationProfiles;
    });

    Profiles.mashProfiles().$loaded().then(function(mashProfiles) {
        $scope.mashProfiles = mashProfiles;
    });
}]);