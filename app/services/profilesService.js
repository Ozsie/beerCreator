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

        var ref = firebase.database().ref();
        profiles.equipment = function() {
            return $firebaseArray(ref.child('equipment'));
        };
      
        profiles.fermentationProfiles = function() {
            return $firebaseArray(ref.child('fermentationProfiles'));
        };
      
        profiles.mashProfiles = function() {
            return $firebaseArray(ref.child('mashProfiles'));
        };
        
        return profiles;
    }
]);