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

            i.src = 'https://s3-us-west-2.amazonaws.com/foureighty.freedommodels.com/' + $scope.data.models[ model ].albums[ album].images[ image ].url;

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

    $scope.scroll = function( event , model ) {

      event.preventDefault();

      window.history.pushState( null , 'any' , '#' + model.url );

      if( model === 0 ) {

        scrollToY( 0 );

      } else {

        scrollToY( document.getElementById( model.url ).offsetTop || 0 );

      }

    };

});
