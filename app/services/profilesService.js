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

        profiles.addEquipment = function(equipment, callback) {
            var equipmentList = $firebaseArray(ref.child('equipment'));
            equipmentList.$add(equipment).then(callback);
        };
      
        profiles.fermentationProfiles = function() {
            return $firebaseArray(ref.child('fermentationProfiles'));
        };

        profiles.addFermentationProfile = function(fermentationProfile, callback) {
            var fermentationProfiles = $firebaseArray(ref.child('fermentationProfiles'));
            fermentationProfiles.$add(fermentationProfile).then(callback);
        };
      
        profiles.mashProfiles = function() {
            return $firebaseArray(ref.child('mashProfiles'));
        };

        profiles.addMashProfile = function(mashProfile, callback) {
            var mashProfiles = $firebaseArray(ref.child('mashProfiles'));
            mashProfiles.$add(mashProfile).then(callback).catch(function(err) {
              console.log(err);
            });
        };
        
        return profiles;
    }
]);