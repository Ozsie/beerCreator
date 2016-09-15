/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var userService = angular.module('beerCreator.services');

userService.factory('Instructions', [function() {

    var instructions = {};
    
    instructions.ingredients = [];
    instructions.getBoilIngredients = function(beer) {
        this.ingredients = [];
        for (var i in beer.ingredients.hops) {
            var hop = beer.ingredients.hops[i];
            if (hop.time == 0 && hop.dryHopTime > 0) {
                continue;
            }
            var timeList = this.ingredients[hop.time];
            if (!timeList) {
                timeList = {time: hop.time, list: []};
            }
            if (this.containsObject(hop, timeList.list)) {
                continue;
            }
            timeList.list.push(hop);
            this.ingredients[hop.time] = timeList;
        }
        for (var j in beer.ingredients.misc) {
            var misc = beer.ingredients.misc[j];
            if (misc.useIn !== 'boil') {
                continue;
            }
            var timeList = this.ingredients[misc.time];
            if (!timeList) {
                timeList = {time: misc.time, list: []};
            }
            if (this.containsObject(misc, timeList.list)) {
                continue;
            }
            timeList.list.push(misc);
            this.ingredients[misc.time] = timeList;
        }
        for (var j in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[j];
            if (!malt.boilTime || malt.boilTime <= 0 || malt.recommendMash) {
                continue;
            }
            if (malt.type === 'malt' || malt.type === 'hull') {
                continue;
            }
            var timeList = this.ingredients[malt.boilTime];
            if (!timeList) {
                timeList = {time: malt.boilTime, list: []};
            }
            if (this.containsObject(malt, timeList.list)) {
                continue;
            }
            timeList.list.push(malt);
            this.ingredients[malt.boilTime] = timeList;
        }
    };
    
    instructions.containsObject = function(obj, list) {
        var x;
        for (x in list) {
            if (list.hasOwnProperty(x) && list[x] === obj) {
                return true;
            }
        }

        return false;
    };
    
    instructions.
    
    return instructions;
}]);