/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var profilesService = angular.module('beerCreator.services');

profilesService.factory('Profiles', ['$firebaseArray',
    function($firebaseArray){
        var profiles = {};
      
        profiles.equipment = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/equipment");
            return $firebaseArray(ref);
        };
      
        profiles.fermentationProfiles = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/fermentationProfiles");
            return $firebaseArray(ref);
        };
      
        profiles.mashProfiles = function() {
            var ref = new Firebase("https://luminous-heat-8761.firebaseio.com/mashProfiles");
            return $firebaseArray(ref);
        };
        
        return profiles;
    }
]);