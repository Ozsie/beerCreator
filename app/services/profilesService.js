/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var profilesService = angular.module('beerCreator.services');

profilesService.factory('Profiles', ['$resource',
    function($resource){
        var profiles = {};
      
        profiles.equipment = function() {
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/equipment/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        profiles.fermentationProfiles = function() {
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/fermentationProfiles/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
      
        profiles.mashProfiles = function() {
            return $resource('https://api.mongolab.com/api/1/databases/beercreator/collections/mashProfiles/?apiKey=n_pSs2E3Xtofxp4Ybar08_XFjKucV64M', {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
        };
        
        return profiles;
    }
]);