angular.module('beerCreator.directives').controller('BoilInstructionsCtrl', function($scope){
    $scope.boilIngredients = [];

    $scope.containsObject = function(obj, list) {
        var x;
        for (x in list) {
            if (list.hasOwnProperty(x) && list[x] === obj) {
                return true;
            }
        }

        return false;
    };

    $scope.getBoilIngredients = function(beer) {
        $scope.boilIngredients = [];
        for (var i in beer.ingredients.hops) {
            var hop = beer.ingredients.hops[i];
            if (hop.time == 0 && hop.dryHopTime > 0) {
                continue;
            }
            var timeList = $scope.boilIngredients[hop.time];
            if (!timeList) {
                timeList = {time: hop.time, list: []};
            }
            if ($scope.containsObject(hop, timeList.list)) {
                continue;
            }
            timeList.list.push(hop);
            $scope.boilIngredients[hop.time] = timeList;
        }
        for (var j in beer.ingredients.misc) {
            var misc = beer.ingredients.misc[j];
            if (misc.useIn !== 'boil') {
                continue;
            }
            var timeList = $scope.boilIngredients[misc.time];
            if (!timeList) {
                timeList = {time: misc.time, list: []};
            }
            if ($scope.containsObject(misc, timeList.list)) {
                continue;
            }
            timeList.list.push(misc);
            $scope.boilIngredients[misc.time] = timeList;
        }
        for (var j in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[j];
            if (!malt.boilTime || malt.boilTime <= 0 || malt.recommendMash) {
                continue;
            }
            if (malt.type === 'malt' || malt.type === 'hull') {
                continue;
            }
            var timeList = $scope.boilIngredients[malt.boilTime];
            if (!timeList) {
                timeList = {time: malt.boilTime, list: []};
            }
            if ($scope.containsObject(malt, timeList.list)) {
                continue;
            }
            timeList.list.push(malt);
            $scope.boilIngredients[malt.boilTime] = timeList;

            return $scope.boilIngredients;
        }

    };
    $scope.getBoilIngredients($scope.beer);

    $scope.$watch(function() {
        return $scope.beer.ingredients;
    }, function() {
        $scope.getBoilIngredients($scope.beer)
    }, true);
});

angular.module('beerCreator.directives').directive('boilInstructions', function() {
    return {
        restrict: 'E',
        replace: true,
        controller: 'BoilInstructionsCtrl',
        scope: {
            beer: '='
        },
        templateUrl: 'directives/boilInstructions/boilInstructions.html',
        link: function(scope, element, attrs, fn) {
        }
    };
});