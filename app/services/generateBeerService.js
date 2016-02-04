/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var generateBeerService = angular.module('beerCreator.services');

generateBeerService.factory('GenerateBeer', ['Ingredients', 'Profiles', function(Ingredients, Profiles) {

    var generateBeer = {
    };
    
    generateBeer.generate = function(input) {
        var style = input.style;
        var abv = input.abv;
        var ebc = input.ebc;
        var ibu = input.ibu;
        var equipment = input.equipment;
        var mash = input.mash;
        var fermentation = input.fermentation;
    };
    
    return generateBeer;
}]);