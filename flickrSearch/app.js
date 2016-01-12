'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('flickrApp', [
    'ui.router',
    'flickrApp.flickr'
])
    //'image-engine-angular',

.config(function($stateProvider, $urlRouterProvider) {
//.config(function($stateProvider, $urlRouterProvider, imgEngConfigProvider) {
//    imgEngConfigProvider.setToken('flckr-token');
//    imgEngConfigProvider.isLite();

    // For any unmatched url, redirect to /home
    //$urlRouterProvider.otherwise("external");
    //
    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: 'views/flickr_grid/flickr_grid_view.html',
            controller: 'FlickrController'
        })
        .state('flickr-search', {
            url: "/flickrSearch",
            templateUrl: 'views/flickr_grid/flickr_grid_view.html',
            controller: 'FlickrController'
        })
        .state('about', {
            url: "/about",
            templateUrl: 'views/about/about_view.html'
        })
        .state('otherwise', {
            url: '*path',
            externalUrl: 'http://www.fibanez.com'
        });
})
.run(function($rootScope, $window) {
    $rootScope.$on(
        '$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            if (toState.externalUrl) {
                event.preventDefault();
                $window.open(toState.externalUrl, '_self');
            }
        }
    );
});
