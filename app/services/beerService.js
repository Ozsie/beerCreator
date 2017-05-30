/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var beerStyleService = angular.module('beerCreator.services');

beerStyleService.factory('Beer', ['$firebaseArray', '$firebaseObject',
  function($firebaseArray, $firebaseObject){
    var beers = {};

    beers.getBeerList = function (userUid) {
        var ref = firebase.database().ref();
        return $firebaseArray(ref.child('beerlist/' + userUid));
    };

    beers.getPublicBeerList = function() {
        var ref = firebase.database().ref();
        return $firebaseArray(ref.child('beerlist/public'));
    };

    beers.getBeer = function(userUid, id) {
        var ref = firebase.database().ref();
        return $firebaseObject(ref.child('beerlist/' + userUid + "/" + id));
    };

    beers.saveBeer = function(beer, userUid, callbackOk, callbackNewBeer) {
        if (beer.$loaded) {
            beer.$loaded().then(function(data) {
                if (beer.$id) {
                    beer.$save().then(callbackOk).catch(function(error) {
                        console.log(error);
                    });
                } else {
                    saveNewBeer(beer, userUid, callbackOk, callbackNewBeer);
                }
            });
        } else {
            saveNewBeer(beer, userUid, callbackOk, callbackNewBeer);
        }
    }

    var saveNewBeer = function(beer, userUid, callbackOk, callbackNewBeer) {
        var ref = firebase.database().ref();
        var beerList = $firebaseArray(ref.child('beerlist/' + userUid));
        var index = beerList.$indexFor(beer.$id);
        if (index > -1) {
            beerList.$remove(index).then(callbackOk).catch(function(error) {
                console.log(error);
            });
        }
        beerList.$add(beer).then(callbackNewBeer);
    }

    beers.setBeerToEdit = function(beer) {
        beers.beerToEdit = beer;
    };

    beers.setNewBeer = function() {
        beers.beerToEdit = {
        name: "",
        style: -1,
        finalVolume: 0,
        og: 0,
        carbonation: {},
        equipment: {},
        fermentation: {},
        mash: {},
        ingredients: {
            malts: [],
            hops: [],
            yeasts: [],
            misc: []
        }
    };
    }

    beers.getBeerToEdit = function() {
        return beers.beerToEdit;
    }
      
    return beers;
  }]);