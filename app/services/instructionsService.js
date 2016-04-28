/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var userService = angular.module('beerCreator.services');

userService.factory('Instructions', [function() {

    var instructions = {};
    
    instructions.calculateStrikeTemp = function(step, beer) {
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
        var waterSpecific = step.waterToAdd * 0.264172;
        var mashSpecific = grainSpecific + waterSpecific;
        
        var grain = grainSpecific * beer.mash.temperatures.grain;
        var mash = mashSpecific * step.temperature;
        return (mash - grain)/waterSpecific;
    };
    
    instructions.ingredients = {};
    instructions.getBoilIngredients = function(beer) {
        for (var i in beer.ingredients.hops) {
            var hop = beer.ingredients.hops[i];
            var timeList = instructions.ingredients[hop.time];
            if (!timeList) {
                timeList = {time: hop.time, list: []};
            }
            if (instructions.containsObject(hop, timeList.list)) {
                continue;
            }
            timeList.list.push(hop);
            instructions.ingredients[hop.time] = timeList;
        }
        for (var j in beer.ingredients.misc) {
            var misc = beer.ingredients.misc[j];
            if (misc.useIn !== 'boil') {
                continue;
            }
            var timeList = instructions.ingredients[misc.time];
            if (!timeList) {
                timeList = {time: misc.time, list: []};
            }
            if (instructions.containsObject(misc, timeList.list)) {
                continue;
            }
            timeList.list.push(misc);
            instructions.ingredients[misc.time] = timeList;
        }
        for (var j in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[j];
            if (!malt.boilTime || malt.boilTime <= 0 || malt.recommendMash) {
                continue;
            }
            if (malt.type === 'malt' || malt.type === 'hull') {
                continue;
            }
            var timeList = instructions.ingredients[malt.boilTime];
            if (!timeList) {
                timeList = {time: malt.boilTime, list: []};
            }
            if (instructions.containsObject(malt, timeList.list)) {
                continue;
            }
            timeList.list.push(malt);
            instructions.ingredients[malt.boilTime] = timeList;
        }
        return instructions.ingredients;
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
    
    instructions.getDecoctionVolume = function(step, beer) {
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
    
    return instructions;
}]);