angular.module('beerCreator.directives', []).directive('menu', function () {
    return {
        restrict: 'E',
        scope: {
            beerList: '=',
            logout: '=',
            logOutAllowed: '=',
            newBeer: '=',
            user: '='
        },
        link: function(scope) {
            var originatorEv;
            scope.openMenu = function($mdOpenMenu, ev) {
              originatorEv = ev;
              $mdOpenMenu(ev);
            };
        },
        templateUrl: 'directives/menu.html'
    };
});