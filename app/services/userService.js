/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var userService = angular.module('beerCreator.services');

userService.factory('User', ['$firebaseAuth', '$location', function($firebaseAuth, $location) {

    var user = {
        authData: undefined
    };
    
    user.login = function(authData) {
        this.authData = authData;
    };
    
    user.logout = function() {
        var ref = new Firebase("https://luminous-heat-8761.firebaseio.com");
        var authObj = $firebaseAuth(ref);
        authObj.$unauth();
        
        authObj.$onAuth(function(authData) {
            if (!authData) {
                console.log("Logged out");
                $location.path("login");
            }
        });
    };
    
    return user;
}]);