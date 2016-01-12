(function() {
    'use strict';

    angular.module( 'ngStickyFooter', [] )

        .directive( "ngStickyFooter", [ '$window',
            function( $window ) {
                return {
                    restrict: 'A',
                    scope: true,
                    link: function(scope, element, attrs) {
                        // Get the heights
                        scope.heights = function() {
                            return {
                                window: $window.innerHeight,
                                elt: element[0].offsetHeight,
                                pageYOffset: $window.pageYOffset
                            };
                        };

                        // Set the offset. It is optional. Generally leave it blank.
                        var offset = attrs.offset || 0;

                        // Relocate the footer.
                        var setFooter = function() {
                            if (scope.windowHeight > scope.eltHeight + offset && scope.pageYOffsetHeight <= 0 ) {
                                scope.footer = {
                                    position: 'absolute',
                                    bottom: 0
                                };
                            } else {
                                scope.footer = {};
                            }
                        };

                        // Watch the heights
                        scope.$watch(scope.heights, function(newValue, oldValue) {
                            scope.windowHeight = newValue.window;
                            scope.eltHeight = newValue.elt;
                            scope.pageYOffsetHeight = newValue.pageYOffset;
                            setFooter();
                        }, true);

                        // Add the listener
                        angular.element($window).bind('scroll', 'resize', function() {
                            scope.$apply();
                        });
                    }
                };
            }] )
}());