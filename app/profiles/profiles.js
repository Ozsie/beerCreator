'use strict';

angular.module('beerCreator.profiles', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profiles', {
    templateUrl: 'profiles/profiles.html',
    controller: 'ProfilesCtrl'
  });
}])

.controller('ProfilesCtrl', ['$scope', '$location', 'Profiles', 'User', function($scope, $location, Profiles, User) {
    if (!User.authData) {
        $location.path('login');
    }
    $scope.selectedList = 'equipment';
    $scope.user = User;

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
            $scope.beer = {fermentation: {primary: {}, type: "One stage"}};
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
            $scope.beer.equipment.user = {displayName: User.displayName, uid: User.authData.uid};
            Profiles.addEquipment($scope.beer.equipment, function() {
              $scope.cancel();
            });
        } else if ($scope.add === 'mashProfiles') {
            $scope.beer.mash.user = {displayName: User.displayName, uid: User.authData.uid};
            Profiles.addMashProfile($scope.beer.mash, function() {
              $scope.cancel();
            });
        } else if ($scope.add === 'fermentationProfiles') {
            $scope.beer.fermentation.user = {displayName: User.displayName, uid: User.authData.uid};
            Profiles.addFermentationProfile($scope.beer.fermentation, function() {
              $scope.cancel();
            });
        }
    };
    
    $scope.$watch(function() {
        return $scope.beer;
    }, function() {
        if ($scope.beer && $scope.beer.equipment && $scope.beer.equipment.boiler && $scope.beer.equipment.boiler.calculatBoilVolume) {
            var boiler = $scope.beer.equipment.boiler;
            boiler.boilVolume = $scope.beer.equipment.batchSize + boiler.boilOff + boiler.coolingLoss + boiler.kettleTopUp;
            boiler.postBoilVolume = boiler.boilVolume - boiler.boilOff - boiler.kettleTopUp;
        }
    }, true);
    
    $scope.$on("$destroy", function(){
        tryDestroy($scope.equipmentList);
        tryDestroy($scope.fermentationProfiles);
        tryDestroy($scope.mashProfiles);
    });

    var tryDestroy = function(object) {
        if (object) {
            object.$destroy();
        }
    }
    
    $scope.addMashStep = function(mash) {
        if (!mash) {
            return;
        }
        if (!mash.steps) {
            mash.steps = [];
        }
        mash.steps.push({});
    
    };
    $scope.removeMashStep = function(mash, index) {
        if (!mash) {
            return;
        }
        if (!mash.steps) {
            return
        }
        mash.steps.splice(index, 1);
    };
    
    $scope.addAging = function(fermentation) {
        fermentation.aging = {};
        if (fermentation.secondary) {
            fermentation.type = "Three stage";
        } else {
            fermentation.type = "Two stage";
        }
    };
    
    $scope.removeAging = function(fermentation) {
        fermentation.aging = undefined;
        if (fermentation.secondary) {
            fermentation.type = "Two stage";
        } else {
            fermentation.type = "One stage";
        }
    };
    
    $scope.addSecondary = function(fermentation) {
        fermentation.secondary = {};
        if (fermentation.aging) {
            fermentation.type = "Three stage";
        } else {
            fermentation.type = "Two stage";
        }
    };
    
    $scope.removeSecondary = function(fermentation) {
        fermentation.secondary = undefined;
        if (fermentation.aging) {
            fermentation.type = "Two stage";
        } else {
            fermentation.type = "One stage";
        }
    };
    
    $scope.remove = function(item) {
        if (item.user.uid === User.authData.uid) {
            switch ($scope.selectedList) {
                case 'equipment':
                    $scope.equipmentList.$remove(item);
                    break;
                case 'fermentationProfiles':
                    $scope.fermentationProfiles.$remove(item);
                    break;
                case 'mashProfiles':
                    $scope.mashProfiles.$remove(item);
                    break;
            }
        }
    };
}]);