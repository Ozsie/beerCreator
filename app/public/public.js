'use strict';

angular.module('beerCreator.public', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/public/:userId/:beerId', {
    templateUrl: 'public/public.html',
    controller: 'PublicCtrl'
  });
}])

.controller('PublicCtrl', ['$scope', '$firebaseObject', '$routeParams', function($scope, $firebaseObject, $routeParams) {
    $scope.userId = $routeParams.userId;
    $scope.beerId = $routeParams.beerId;
    var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/beerlist/" + $scope.userId + "/" + $scope.beerId);

    var obj = $firebaseObject(ref);

    // to take an action after the data loads, use the $loaded() promise
    obj.$loaded().then(function(data) {
        console.log("loaded record:", obj.$id, obj.someOtherKeyInData);
        if (data.public) {
            $scope.beer = data;
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
}]);