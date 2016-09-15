angular.module('beerCreator.directives').directive('mashInstructions', function() {
    return {
        restrict: 'E',
        replace: true,
        controller: 'MashInstructionsCtrl',
        scope: {
            beer: '='
        },
        templateUrl: 'directives/mashInstructions/mashInstructions.html',
        link: function(scope, element, attrs, fn) {
        }
    };
});

angular.module('beerCreator.directives').controller('MashInstructionsCtrl', function($scope){
    $scope.calculateStrikeTemp = function(step, beer) {
        var maltWeight = 0;
        for (var i in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[i];
            if (malt.recommendMash) {
                maltWeight += malt.amount;
            }
        }
        // Convert grams to pounds for formula
        maltWeight = maltWeight * 0.00220462;
        var grainSpecific = maltWeight * 0.05;
        // Convert liters to gallons for formula
        var waterSpecific = 0;
        if (step.waterToAdd) {
            waterSpecific = step.waterToAdd * 0.264172;
        } else {
            waterSpecific = $scope.waterToAdd(beer) * 0.264172;
        }
        var mashSpecific = grainSpecific + waterSpecific;

        var grain = grainSpecific * beer.mash.temperatures.grain;
        var mash = mashSpecific * step.temperature;
        return (mash - grain)/waterSpecific;
    };

    $scope.waterToAdd = function(beer) {
        var maltWeight = 0;
        for (var index in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[index];
            if ((malt.type === 'malt' || malt.type === 'husk') && malt.recommendMash) {
               maltWeight += malt.amount;
            }
        }
        return (maltWeight / beer.mash.properties.waterGrainRation)
    };

    $scope.getDecoctionVolume = function(step, beer) {
        var decoctionStep = 0;
        var addedVolume = 0;
        for (var j in beer.mash.steps) {
            if (beer.mash.steps[j].type === 'temperature' || beer.mash.steps[j].type === 'infusion' ) {
                addedVolume += beer.mash.steps[j].waterToAdd;
            }
        }
        for (var i in beer.mash.steps) {
            if (beer.mash.steps[i].type === 'decoction') {
                if (beer.mash.steps[i] === step) {
                    return (1 / (3 + i)) * addedVolume;
                }
                i++;
            }
        }
    };

    $scope.stepOne = $scope.beer.mash.steps[0];
});