(function() {
    'use strict';

    angular.module('flickrServices',['ngResource'])

    .factory('Flickr',['$http','$q', function($http, $q){
        var self = this;
        self.perPage =  100;
        self.api_key = "put_api_key";
        self.base_url= "https://api.flickr.com/services/rest/";
        self.timeout_sec = 5;

        self.search = function(search, page) {
            var deferred = $q.defer(),
                timeout = $q.defer(),
                timedOut = false;

            var params = {
                method: (search != null && search.length > 0) ? 'flickr.photos.search' : 'flickr.photos.getRecent',
                api_key: self.api_key,
                per_page: self.perPage,
                format: 'json',
                nojsoncallback: 1,
                page: (page != null && page > 0) ? page : 1,
                extras: 'description,tags,machine_tags,date_taken,owner_name,url_n,url_o'
                        // Others
                        //'original_format, last_update, geo,' +
                        //'machine_tags, o_dims, views, media, path_alias,' +
                        //'license, date_upload, icon_server' +
                        //'url_sq, url_t, url_s, url_q, url_m, url_z,' +
                        //'url_c, url_l',
            };

            if ((search != null && search.length > 0)) {
                params.text = search;
            }

            setTimeout(function () {
                timedOut = true;
                timeout.resolve();
            }, (1000 * self.timeout_sec));

            $http({
                method: 'GET',
                url: self.base_url,
                params: params,
                timeout: timeout.promise
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                if (timedOut) {
                    result.reject({
                        error: 'timeout',
                        message: 'Request took longer than ' + self.timeout_sec + ' seconds.'
                    });
                } else {
                    result.reject(data);
                }
            });

            return deferred.promise;
        };

        self.getPhotoInfo = function (photo) {
            var deferred = $q.defer(),
                timeout = $q.defer(),
                timedOut = false;

            var params = {
                method: 'flickr.photos.getInfo',
                api_key: self.api_key,
                format: 'json',
                nojsoncallback: 1
            };

            setTimeout(function () {
                timedOut = true;
                timeout.resolve();
            }, (1000 * self.timeout_sec));

            $http({
                method: 'GET',
                url: 'https://api.flickr.com/services/rest',
                params: params,
                timeout: timeout.promise
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                if (timedOut) {
                    result.reject({
                        error: 'timeout',
                        message: 'Request took longer than ' + self.timeout_sec + ' seconds.'
                    });
                } else {
                    result.reject(data);
                }
            });

            return deferred.promise;
        };

        // build the photo URL
        self.getImageSrc = function (photo) {
            return 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_b.jpg';
        };

        return this;
    }]);
}());
