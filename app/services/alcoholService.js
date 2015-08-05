/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var alcoholService = angular.module('beerCreator.services');

alcoholService.factory('Alcohol', function() {

    var alcohol = {}; 
    
    alcohol.calculateOriginalGravity = function(beer) {
        var GALLON_LITRE_RATIO = 3.78541178;
        var POUND_GRAM_RATION = 453.59237;
        
        var totalOg = 1000;
        var volume = beer.equipment.mashLauterTun.volume;
        if (beer.equipment.mashLauterTun.adjustVolumeForDeadSpace) {
            volume = volume - beer.equipment.mashLauterTun.deadSpace;
        }
        volume = volume / GALLON_LITRE_RATIO;
        for (var maltIndex in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[maltIndex];
            var ppg = malt.yield * 46;
            var og = ((malt.amount / POUND_GRAM_RATION) * ppg * beer.equipment.efficiency) / volume;
            totalOg += og;
        }
        
        totalOg = totalOg / 1000;
        
        beer.og = totalOg;
        return totalOg;
    };

    alcohol.calculateFinalGravity = function(beer) {
        var fg = 0;
        
        var attenuation = 0;
        for (var yeastIndex in beer.ingredients.yeasts) {
            var yeast = beer.ingredients.yeasts[yeastIndex];
            attenuation += yeast.attenuation;
        }
        
        attenuation = attenuation / beer.ingredients.yeasts.length;
        
        fg = 1 + ((beer.og * (1 - attenuation)) / 1000);
        beer.fg = fg;
        
        return fg;
    };
    
    alcohol.calculateABV = function(beer) {
        var abv = 0;
        abv = (beer.og - beer.fg) * 131;
        beer.abv = abv;
        return abv;
    };
    
    return alcohol;
});