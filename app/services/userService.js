/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var userService = angular.module('beerCreator.services');

userService.factory('User', function() {

    var user = {}; 
    
    user.login = function(authData) {
        user.authData = authData;
    };
    
    return user;
});