// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// main function
function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY,
        scrollTargetY = scrollTargetY || 0,
        speed = speed || 2000,
        easing = easing || 'easeOutSine',
        currentTime = 0;

    // min time .1, max time .8 seconds
    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
        easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

    // add animation loop
    function tick() {
        currentTime += 1 / 60;

        var p = currentTime / time;
        var t = easingEquations[easing](p);

        if (p < 1) {
            requestAnimFrame(tick);

            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            console.log('scroll done');
            window.scrollTo(0, scrollTargetY);
        }
    }

    // call it once to get started
    tick();
}

window.onload = function() {

  window.addEventListener( 'scroll' , function() {

    /* Sticky */

    if( document.getElementsByTagName( 'html' )[ 0 ].classList.contains( 'no-csspositionsticky' ) ) {

      var menu = document.getElementsByTagName( 'header' )[ 0 ];

      var offset = window.innerHeight / 20;

      offset <= window.scrollY ? menu.classList.add( 'sticky' ) : menu.classList.remove( 'sticky' );

    }

    /* Parallax */

    if( window.innerWidth > window.innerHeight ) {

      var models = document.getElementsByTagName( 'section' );

      for( var index = 0 ; index < models.length ; index++ ) {

        if( window.scrollY >= models[ index ].offsetTop - window.innerHeight && window.scrollY <= models[ index ].offsetTop + window.innerHeight ) {

          var image = models[ index ].getElementsByTagName( 'img' )[ 0 ];

          var delta = models[ index ].offsetTop - window.scrollY;

          image.style.webkitTransform = 'translateY( ' + delta / 2 + 'px )';

          image.style.mozTransform = 'translateY( ' + delta / 2 + 'px )';

          image.style.msTransform = 'translateY( ' + delta / 2 + 'px )';

          image.style.transform = 'translateY( ' + delta / 2 + 'px )';

        }

      }

    }

  });

};

angular

  .module( 'app' , [])

  .factory( 'socket' , [ '$rootScope' , function ( $rootScope ) {

    var socket = io.connect( 'https://api.agencycloud.io:443' );

    return {

      on : function ( eventName , callback ) {

        socket.on( eventName , function () {

          var args = arguments;

          $rootScope.$apply( function () {

            callback.apply( socket , args );

          });

        });

      },

      emit: function ( eventName , data , callback ) {

        socket.emit( eventName , data , function () {

          var args = arguments;

          $rootScope.$apply( function () {

            if ( callback ) {

              callback.apply( socket , args );

            }

          });

        })

      }

    };

  }])

  .controller( 'Controller' , function( $scope , $http , socket ) {

    socket.on( 'welcome' , function( message ) {

      console.log( message );

    });

    socket.emit( 'data:load' , 'freedom' );

    socket.on( 'data:loaded' , function( data ) {

      $scope.data = JSON.parse( data );

      var prepare = function() {

        for( var model = 0; model < $scope.data.models.length; model++ ) {

          for( var album = 0; album < $scope.data.models[ model ].albums.length; album++ ) {

            for( var image = 0; image < $scope.data.models[ model ].albums[ album ].images.length; image++ ) {

              if( image === 0 ) {

                if( $scope.data.models[ model ].albums[ album ].images[ image ].orientation === 'landscape' ) {

                  $scope.data.models[ model ].albums[ album ].images[ image ].class = 'double';

                } else {

                  $scope.data.models[ model ].albums[ album ].images[ image ].class = 'left';

                }

              } else {

                if( $scope.data.models[ model ].albums[ album ].images[ image ].orientation === 'landscape' ) {

                  $scope.data.models[ model ].albums[ album ].images[ image ].class = 'double';

                } else {

                  if( $scope.data.models[ model ].albums[ album ].images[ image - 1 ].class === 'double' ) {

                    $scope.data.models[ model ].albums[ album ].images[ image ].class = 'left';

                  } else {

                    if( $scope.data.models[ model ].albums[ album ].images[ image - 1 ].class === 'left' ) {

                      $scope.data.models[ model ].albums[ album ].images[ image ].class = 'right';

                    } else {

                      $scope.data.models[ model ].albums[ album ].images[ image ].class = 'left';

                    }

                  }

                }

              }

            }

          }

        }

        for( var model = 0; model < $scope.data.models.length; model++ ) {

          for( var album = 0; album < $scope.data.models[ model ].albums.length; album++ ) {

            $scope.data.models[ model ].albums[ album ].pages = [];

            for( var image = 0; image < $scope.data.models[ model ].albums[ album ].images.length; image++ ) {

              if( $scope.data.models[ model ].albums[ album ].images[ image ].class === 'double' || $scope.data.models[ model ].albums[ album ].images[ image ].class === 'left' ) {

                $scope.data.models[ model ].albums[ album ].pages.push( $scope.data.models[ model ].albums[ album ].pages.length );

              }

            }

          }

        }

        $scope.$apply();

      };

      var images = 0;

      for( var model = 0; model < $scope.data.models.length; model++ ) {

        for( var album = 0; album < $scope.data.models[ model ].albums.length; album++ ) {

          for( var image = 0; image < $scope.data.models[ model ].albums[ album].images.length; image++ ) {

            images += 1;

          }

        }

      }

      for( var model = 0; model < $scope.data.models.length; model++ ) {

        for( var album = 0; album < $scope.data.models[ model ].albums.length; album++ ) {

          for( var image = 0; image < $scope.data.models[ model ].albums[ album].images.length; image++ ) {

            var i = new Image();

            i.image = image;

            i.album = album;

            i.model = model;

            i.addEventListener( 'load' , function() {

              $scope.data.models[ this.model ].albums[ this.album ].images[ this.image ].orientation = this.height > this.width ? 'portrait' : 'landscape';

              images -= 1;

              if( images === 0 ) {

                prepare();

              }

            } , false );

            i.src = $scope.data.models[ model ].albums[ album].images[ image ].url;

          }

        }

      }

    });

    $scope.open = function( model , album ) {

      scrollToY( document.getElementById( model ).offsetTop + document.getElementById( model ).getElementsByTagName( 'figure' )[ 0 ].offsetHeight , 1500 , 'easeInOutQuint' );

    };

    $scope.close = function( model , album ) {

      scrollToY( document.getElementById( model ).offsetTop , 1500 , 'easeInOutQuint' );

      document.getElementById( model + "-" + album + "-0" ).checked = true;

    };

});
