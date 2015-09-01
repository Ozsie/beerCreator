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
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/malts/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        ingredients.hops = function() {
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/hops/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        ingredients.yeasts = function() {
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/yeasts/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        ingredients.misc = function() {
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/misc/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
        
        return ingredients;
    }
]);