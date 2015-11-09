'use strict';

angular.module('beerCreator.profiles', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profiles', {
    templateUrl: 'profiles/profiles.html',
    controller: 'ProfilesCtrl'
  });
}])

.controller('ProfilesCtrl', ['$scope', 'Profiles', function($scope, Profiles) {
        
    $scope.selectedList = 'equipment';

    Profiles.equipment().$loaded().then(function(equipment) {
        $scope.equipmentList = equipment;
    });

    Profiles.fermentationProfiles().$loaded().then(function(fermentationProfiles) {
        $scope.fermentationProfiles = fermentationProfiles;
    });

    Profiles.mashProfiles().$loaded().then(function(mashProfiles) {
        $scope.mashProfiles = mashProfiles;
    });
    
    $scope.selectList = function(type) {
        $scope.selectedList = type;
    };
    
    $scope.addNew = function(type) {
        $scope.add = type;
        if (type === 'equipment') {
            $scope.beer = {equipment: {}};
        } else if (type === 'mashProfiles') {
            $scope.beer = {mash: {}};
        } else if (type === 'fermentationProfiles') {
            $scope.beer = {fermentation: {}};
        }
        $scope.addEquipment = true;
    };
    
    $scope.cancel = function() {
        $scope.add = undefined;
        $scope.beer = undefined;
        $scope.addEquipment = false;
    };
    
    $scope.save = function() {
        if ($scope.add === 'equipment') {
            $scope.equipmentList.$add($scope.beer.equipment);
        } else if ($scope.add === 'equipment') {
            $scope.mashProfiles.$add($scope.beer.mash);
        } else if ($scope.add === 'fermentationProfiles') {
            $scope.fermentationProfiles.$add($scope.beer.fermentation);
        }
        $scope.cancel();
    };
    
    $scope.updateBoilVolume = function() {
        if ($scope.beer.equipment && $scope.beer.equipment.boiler.calculatBoilVolume) {
            var boiler = $scope.beer.equipment.boiler;
            boiler.boilVolume = $scope.beer.equipment.batchSize + boiler.boilOff + boiler.coolingLoss + boiler.kettleTopUp;
            boiler.postBoilVolume = boiler.boilVolume - boiler.boilOff - boiler.kettleTopUp;
        }
    };
    
    $scope.$on("$destroy", function(){
        $scope.equipmentList.$destroy();
        $scope.fermentationProfiles.$destroy();
        $scope.mashProfiles.$destroy();
    });
}]);