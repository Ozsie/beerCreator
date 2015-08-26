/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var ingredientService = angular.module('beerCreator.services');

ingredientService.factory('Ingredients', ['$resource',
    function($resource){
        var ingredients = {};
      
        ingredients.grains = function() {
            return $resource('/BeerCreator/grains.json', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        ingredients.hops = function() {
            return $resource('/BeerCreator/hops.json', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        ingredients.yeasts = function() {
            return $resource('/BeerCreator/yeasts.json', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        ingredients.misc = function() {
            return $resource('/BeerCreator/misc.json', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
        
        return ingredients;
    }
]);