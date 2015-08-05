/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var colorConversionService = angular.module('beerCreator.services');

colorConversionService.factory('ColorConversion', function() {

    var colorConversion = {}; 

    colorConversion.convert = function(ebc) {
        var rounded = Math.round(ebc);
        switch (rounded) {
            case 1: return "#F3F993";
            case 2: return "#F5F75C";
            case 3: return "#F6F513";
            case 4: return "#EAE615";
            case 5: return "#E0D01B";
            case 6: return "#D5BC26";
            case 7: return "#CDAA37";
            case 8: return "#C1963C";
            case 9: return "#BE8C3A";
            case 10: return "#BE823A";
            case 11: return "#C17A37";
            case 12: return "#BF7138";
            case 13: return "#BC6733";
            case 14: return "#B26033";
            case 15: return "#A85839";
            case 16: return "#985336";
            case 17: return "#8D4C32";
            case 18: return "#7C452D";
            case 19: return "#6B3A1E";
            case 20: return "#5D341A";
            case 21: return "#4E2A0C";
            case 22: return "#4A2727";
            case 23: return "#361F1B";
            case 24: return "#261716";
            case 25: return "#231716";
            case 26: return "#19100F";
            case 27: return "#16100F";
            case 28: return "#120D0C";
            case 29: return "#100B0A";
            case 30: return "#050B0A";
            default:
            return "#000000";
        }
    };
    
    colorConversion.calculateTotalEBC = function(beer) {
        var colorSum = 0;
        for (var maltIndex in beer.ingredients.malts) {
            var malt = beer.ingredients.malts[maltIndex];
            var colorPart = ((malt.amount / 1000) * malt.color);
            if (malt.mash) {
                colorPart = colorPart * beer.equipment.efficiency;
            }
            colorSum += colorPart;
        }
        
        for (var othersIndex in beer.ingredients.others) {
            var other = beer.ingredients.others[othersIndex];
            if (other.color && other.unit === 'g') {
                colorSum += ((other.amount / 1000) * other.color);
            } else if (other.color && other.unit === 'l') {
                colorSum += (other.amount * other.color);
            }
        }
        if (beer.finalVolume) {
            colorSum = colorSum / beer.finalVolume;
        }
        
        return colorSum;
    };
    
    colorConversion.invert = function(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1);           // remove #
        color = parseInt(color, 16);          // convert to integer
        color = 0xFFFFFF ^ color;             // invert three bytes
        color = color.toString(16);           // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color;                  // prepend #
        return color;
    };
    
    return colorConversion;
});