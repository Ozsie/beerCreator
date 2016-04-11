/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var bitternessService = angular.module('beerCreator.services');

bitternessService.factory('Bitterness', function() {

    var bitterness = {}; 

    bitterness.tinseth = function(beer) {
        var totalIBU = 0;
        if (beer.equipment && beer.equipment.batchSize) {
            for (var hopIndex in beer.ingredients.hops) {
                var hop = beer.ingredients.hops[hopIndex];
                var concentration = (hop.alpha * hop.amount * 1000) / beer.equipment.batchSize;
                var bigness = 1.65 * Math.pow(0.000125, (beer.og - 1));
                var time = (1 - Math.pow(Math.E, -0.04 * hop.time)) / 4.15;
                var utilization = bigness * time;
                totalIBU += concentration * utilization;
            }
        }
        totalIBU = totalIBU.toFixed(1);
        beer.ibu = totalIBU;
        return totalIBU;
    };
    
    return bitterness;
});