/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var beerStyleService = angular.module('beerCreator.services', ['ngResource']);

beerStyleService.factory('BeerStyles', ['$resource',
  function($resource){
    return $resource('/BeerCreator/beerStyles.json', {}, {
        query: {method:'GET', params:{}, isArray:true}
    });
  }]);