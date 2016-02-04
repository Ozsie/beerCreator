angular.module('beerCreator.directives').directive('notesRow', function () {
    return {
        restrict: 'E',
        scope: {
          notes: '=notes'
        },
        templateUrl: 'directives/notesRow.html'
    };
});