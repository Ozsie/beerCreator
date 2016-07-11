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

        var ref = firebase.database().ref();
      
        ingredients.grains = function() {
            return $firebaseArray(ref.child('malts'));
        };
      
        ingredients.hops = function() {
            return $firebaseArray(ref.child('hops'));
        };
      
        ingredients.yeasts = function() {
            return $firebaseArray(ref.child('yeasts'));
        };
      
        ingredients.misc = function() {
            return $firebaseArray(ref.child('misc'));
        };
        
        return ingredients;
    }
]);