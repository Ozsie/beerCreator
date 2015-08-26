/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var editBeerService = angular.module('beerCreator.services');

editBeerService.factory('EditBeer', function() {

    var editBeer = {}; 
    
    editBeer.setBeerToEdit = function(beer) {
        editBeer.beerToEdit = beer;
    };
    
    editBeer.setNewBeer = function() {
        editBeer.beerToEdit = {
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
    
    editBeer.getBeerToEdit = function() {
        return editBeer.beerToEdit;
    }
    
    return editBeer;
});