'use strict';

angular.module('beerCreator.ingredients', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ingredients', {
    templateUrl: 'ingredients/ingredients.html',
    controller: 'IngredientsCtrl'
  });
}])

.controller('IngredientsCtrl', ['$scope', 'Ingredients', 'ColorConversion', 'User', function($scope, Ingredients, ColorConversion, User) {
        
    $scope.selectedList = 'malt';

    $scope.user = User;
    
    Ingredients.grains().$loaded().then(function(grains) {
        $scope.grainList = grains;
    });
        
    Ingredients.hops().$loaded().then(function(hops) {
        $scope.hopList = hops;
    });
        
    Ingredients.yeasts().$loaded().then(function(yeasts) {
        $scope.yeastList = yeasts;
    });
        
    Ingredients.misc().$loaded().then(function(misc) {
        $scope.miscList = misc;
    });
    
    $scope.getColor = function(grain) {
        var rgb = ColorConversion.convert(grain.color);
        return rgb;
    };
    
    $scope.getInvertedColor = function(grain) {
        var rgb = $scope.getColor(grain)
        var inverted = ColorConversion.invert(rgb)
        return inverted;
    };
    
    $scope.selectList = function(type) {
        $scope.selectedList = type;
    };
    
    $scope.$on("$destroy", function(){
        $scope.miscList.$destroy();
        $scope.yeastList.$destroy();
        $scope.hopList.$destroy();
        $scope.grainList.$destroy();
    });
    
    $scope.addIngredient = function(selectedList) {
        $scope.toAdd = selectedList;
    };
    
    $scope.add = function() {
        if (!$scope.editedIngredient.name) {
            $scope.error = "no-name";
            return;
        }
        $scope.editedIngredient.user = {displayName: User.displayName, uid: User.authData.uid};
        switch($scope.toAdd) {
            case 'malt':
                $scope.grainList.$add(angular.copy($scope.editedIngredient));
                break;
            case 'hops':
                $scope.hopList.$add(angular.copy($scope.editedIngredient));
                break;
            case 'yeast':
                $scope.yeastList.$add(angular.copy($scope.editedIngredient));
                break;
            case 'misc':
                $scope.miscList.$add(angular.copy($scope.editedIngredient));
                break;
        }
        
        $scope.cancel();
    };
    
    $scope.cancel = function() {
        $scope.editedIngredient = undefined;
        $scope.toAdd = undefined;
        $scope.error = undefined;
    };
    
    $scope.remove = function(ingredient) {
        if (ingredient.user.uid === User.authData.uid) {
            switch ($scope.selectedList) {
                case 'malt':
                    $scope.grainList.$remove(ingredient);
                    break;
                case 'hops':
                    $scope.hopList.$remove(ingredient);
                    break;
                case 'yeast':
                    $scope.yeastList.$remove(ingredient);
                    break;
                case 'misc':
                    $scope.miscList.$remove(ingredient);
                    break;
            }
        }
    };
}]);