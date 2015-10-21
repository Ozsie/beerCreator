/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var ingredientService = angular.module('beerCreator.services');

ingredientService.factory('Ingredients', ['$firebaseArray',
    function($firebaseArray){
        var ingredients = {};
      
        ingredients.grains = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/malts");
            return $firebaseArray(ref);
        };
      
        ingredients.hops = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/hops");
            return $firebaseArray(ref);
        };
      
        ingredients.yeasts = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/yeasts");
            return $firebaseArray(ref);
        };
      
        ingredients.misc = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/misc");
            return $firebaseArray(ref);
        };
        
        return ingredients;
    }
]);