/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var beerStyleService = angular.module('beerCreator.services', ['ngResource', 'firebase']);

beerStyleService.factory('BeerStyles', ['$firebaseArray',
  function($firebaseArray){
    var beerStyle = {}; 

    beerStyle.getStyles = function () {
        var ref = firebase.database().ref();
        return $firebaseArray(ref.child('beerstyles'));
    };
      
    return beerStyle;
  }]);