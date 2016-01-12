'use strict';

angular.module('flickrApp.flickr', [
        'ngRoute',
        'flickrServices',
        'ngTextTruncate',
        'ngScrollbars',
        'angularGrid',
        'infinite-scroll',
        'ngStickyFooter',
        'ngAnimate'
    ])

    .config(function (ScrollBarsProvider) {
        ScrollBarsProvider.defaults = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced:{
                updateOnContentResize: true
            },
            setHeight: 100,
            scrollInertia: 0
        };
    })

    .controller('FlickrController', ['$scope', '$http', 'Flickr', 'angularGridInstance',

        function($scope, $http, Flickr, angularGridInstance) {
            var searchForm;
            $scope.loading = false;
            $scope.photos = [];

            $scope.clear = function() {
                $scope.photos = [];
                $scope.loading = false;
            };

            $scope.search = function(search, page) {
                if ($scope.loading) return;
                $scope.loading = true;

                console.log("search="+search+"  page="+page);

                searchForm = search;
                var promise = Flickr.search(search, page);
                promise.then(function(data) {
                    for (var i = 0; i < data.photos.photo.length; i++) {
                        data.photos.photo[i].tags = data.photos.photo[i].tags.split(' ').join(', ');
                        $scope.photos.push(data.photos.photo[i]);
                    }
                    //$scope.photos = data.photos.photo;
                    $scope.page = data.photos.page;
                    $scope.pages = data.photos.pages;
                    $scope.total = data.photos.total;
                    $scope.loading = false;
                    $scope.footer = {};

                }, function(err) {
                    console.log('Failed: ' + err);
                    $scope.loading = false;
                });
            };

            $scope.nextPage = function() {
                if ($scope.loading || angular.isUndefined($scope.page)) return;
                $scope.search(searchForm,++$scope.page);
            };

            $scope.refresh = function(){
                angularGridInstance.flickr.refresh();
            };

        }]
    );
