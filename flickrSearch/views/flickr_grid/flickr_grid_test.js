'use strict';

describe('flickrApp.flickr module', function() {

    beforeEach(function(){
        jasmine.addMatchers({
            toEqualData: function(expected) {
                return {
                    compare: function(actual, expected) {
                        return {
                            pass: angular.equals(actual, expected)
                        };
                    }
                };
            }
        });
    });

    beforeEach(module('flickrApp.flickr'));

    describe('flickrApp controller', function(){
        var scope, ctrl, $httpBackend;

        var eltInRowExpected = 3;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('https://api.flickr.com/services/rest?api_key=be579173e48f281d0da16e7f2d80f761&format=json&method=flickr.photos.search&nojsoncallback=1').
            respond({
                "photos": {
                    "page": 1,
                    "pages": 6443,
                    "perpage": 100,
                    "total": "644300",
                    "photo": [
                        {
                            "id": "23541533756",
                            "owner": "122325232@N02",
                            "secret": "0dff13218c",
                            "server": "5698",
                            "farm": 6,
                            "title": "Christmas-fit-for-a-Princess",
                            "ispublic": 1,
                            "isfriend": 0,
                            "isfamily": 0
                        },
                        {
                            "id": "23458886502",
                            "owner": "124324894@N03",
                            "secret": "8a60ac67c8",
                            "server": "641",
                            "farm": 1,
                            "title": "Jack Sparrow",
                            "ispublic": 1,
                            "isfriend": 0,
                            "isfamily": 0
                        },
                        {
                            "id": "23532721296",
                            "owner": "22934398@N05",
                            "secret": "485608c0d4",
                            "server": "737",
                            "farm": 1,
                            "title": "Manga loot",
                            "ispublic": 1,
                            "isfriend": 0,
                            "isfamily": 0
                        }
                    ]
                },
                "stat": "ok"
            });

            scope = $rootScope.$new();
            ctrl = $controller('FlickrController', {$scope: scope});
        }));

        afterEach(function () {
            //$httpBackend.verifyNoOutstandingExpectation();
            //$httpBackend.verifyNoOutstandingRequest();
        });

        it('should ....', inject(function($controller) {
            expect(ctrl).toBeDefined();
        }));

        it('should return default data', function() {
            expect(scope.eltInRow).toBe(eltInRowExpected);
            expect(scope.results).toEqualData([]);

        });

        it('should return mocked data', function() {
            scope.search();
            $httpBackend.flush();

            expect(scope.results.length).toBe(1);

            scope.results.forEach(function(value, key){
                expect(value.length).toBe(eltInRowExpected);
            });
        });

    });
});