/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var pageService = angular.module('beerCreator.services');

pageService.factory('Page', function(){
  var title = 'Beer Creator';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; }
  };
});