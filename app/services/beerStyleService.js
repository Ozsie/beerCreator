/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var beerStyleService = angular.module('beerCreator.services', ['ngResource']);

beerStyleService.factory('BeerStyles', ['$resource',
  function($resource){
    return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/styles/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
        query: {method:'GET', params:{}, isArray:true}
    });
  }]);