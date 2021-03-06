/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var userService = angular.module('beerCreator.services');

userService.factory('User', ['$firebaseAuth', '$location', 'Ingredients', function($firebaseAuth, $location, Ingredients) {

    var user = {
        authData: undefined,
        settings: undefined,
        loggedIn: false
    };
    
    user.login = function(authData, settings) {
        this.authData = authData;
        if (settings.displayName) {
            this.displayName = settings.displayName;
        } else {
        }
        if (authData.providerData) {
            this.displayName = authData.providerData[0].displayName;
            this.picture = authData.providerData[0].photoUrl;
        }
        this.settings = settings.settings;
        this.loggedIn = true;
    };
    
    user.logout = function() {
        firebase.auth().signOut().then(function() {
            window.localStorage.setItem("autologin", false);
            user.loggedIn = false;
            console.log("Logged out");
            $location.path("login");
        }, function(error) {
            console.log(error);
        });
    };
    
    return user;
}]);