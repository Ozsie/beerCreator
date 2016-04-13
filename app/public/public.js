'use strict';

angular.module('beerCreator.public', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/public/:userId/:beerId', {
    templateUrl: 'public/public.html',
    controller: 'PublicCtrl'
  });
}])

.controller('PublicCtrl', ['$scope', '$firebaseObject', '$routeParams', 'ColorConversion', 'Page', function($scope, $firebaseObject, $routeParams, ColorConversion, Page) {
    $scope.userId = $routeParams.userId;
    $scope.beerId = $routeParams.beerId;
    var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/beerlist/" + $scope.userId + "/" + $scope.beerId);

    var obj = $firebaseObject(ref);

    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function(data) {
        if (data.public) {
            $scope.beer = data;
            $scope.beerColor = $scope.getColor($scope.beer);
            Page.setTitle("Beer Creator - " + $scope.beer.name);
        }
    });
    
    $scope.downloadJSON = function() {
        var obj = {
                    abv: angular.copy($scope.beer.abv),
                    color: angular.copy($scope.beer.color),
                    equipment: angular.copy($scope.beer.equipment),
                    fermentation: angular.copy($scope.beer.fermentation),
                    fg: angular.copy($scope.beer.fg),
                    finalVolume: angular.copy($scope.beer.finalVolume),
                    fullStyle: angular.copy($scope.beer.fullStyle),
                    ibu: angular.copy($scope.beer.ibu),
                    ingredients: angular.copy($scope.beer.ingredients),
                    mash: angular.copy($scope.beer.mash),
                    name: angular.copy($scope.beer.name),
                    og: angular.copy($scope.beer.org),
                    parentStyle: angular.copy($scope.beer.parentStyle),
                    style: angular.copy($scope.beer.style)
                };
        var beer = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        var a = document.createElement('a');
        a.href = 'data:' + beer;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';
        a.click();
    };
    
    $scope.downloadPDF = function() {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        
        doc.fromHTML($('#content').html(), 15, 15, {
            'width': 170,
                'elementHandlers': specialElementHandlers
        });
        doc.save($scope.beer.name + '.pdf');
    };
    
    $scope.getPercentage = function(beer, malt) {
        var totalAmount = 0;
        for (var index in beer.ingredients.malts) {
            totalAmount += beer.ingredients.malts[index].amount;
        }
        
        var percent = (malt.amount / totalAmount) * 100;
        return percent;
    };
    
    $scope.getColor = function(grain) {
        var rgb = ColorConversion.convert(grain.color);
        return rgb;
    };
    
    $scope.calculateStrikeTemp = function(step) {
        var maltWeight = 0;
        for (var i in $scope.beer.ingredients.malts) {
            var malt = $scope.beer.ingredients.malts[i];
            if (malt.recommendMash) {
                maltWeight += malt.amount;
            }
        }
        // Convert grams to pounds for formula
        maltWeight = maltWeight * 0.00220462;
        var grainSpecific = maltWeight * 0.05;
        // Convert liters to gallons for formula
        var waterSpecific = step.waterToAdd * 0.264172;
        var mashSpecific = grainSpecific + waterSpecific;
        
        var grain = grainSpecific * $scope.beer.mash.temperatures.grain;
        var mash = mashSpecific * step.temperature;
        return (mash - grain)/waterSpecific;
    };
    
    $scope.ingredients = {};
    $scope.getBoilIngredients = function() {
        for (var i in $scope.beer.ingredients.hops) {
            var hop = $scope.beer.ingredients.hops[i];
            var timeList = $scope.ingredients[hop.time];
            if (!timeList) {
                timeList = {time: hop.time, list: []};
            }
            if ($scope.containsObject(hop, timeList.list)) {
                continue;
            }
            timeList.list.push(hop);
            $scope.ingredients[hop.time] = timeList;
        }
        for (var j in $scope.beer.ingredients.misc) {
            var misc = $scope.beer.ingredients.misc[j];
            if (misc.useIn !== 'boil') {
                continue;
            }
            var timeList = $scope.ingredients[misc.time];
            if (!timeList) {
                timeList = {time: misc.time, list: []};
            }
            if ($scope.containsObject(misc, timeList.list)) {
                continue;
            }
            timeList.list.push(misc);
            $scope.ingredients[misc.time] = timeList;
        }
        for (var j in $scope.beer.ingredients.malts) {
            var malt = $scope.beer.ingredients.malts[j];
            if (!malt.boilTime || malt.boilTime <= 0 || malt.recommendMash) {
                continue;
            }
            if (malt.type === 'malt' || malt.type === 'hull') {
                continue;
            }
            var timeList = $scope.ingredients[malt.boilTime];
            if (!timeList) {
                timeList = {time: malt.boilTime, list: []};
            }
            if ($scope.containsObject(malt, timeList.list)) {
                continue;
            }
            timeList.list.push(malt);
            $scope.ingredients[malt.boilTime] = timeList;
        }
        return $scope.ingredients;
    };
    
    $scope.containsObject = function(obj, list) {
        var x;
        for (x in list) {
            if (list.hasOwnProperty(x) && list[x] === obj) {
                return true;
            }
        }

        return false;
    };
    
    $scope.getDecoctionVolume = function(step) {
        var decoctionStep = 0;
        var addedVolume = 0;
        for (var j in beer.mash.steps) {
            if (beer.mash.steps[j].type === 'temperature' ||
                    beer.mash.steps[j].type === 'infusion' ) {
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
}]);