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

  });

};

/* Parallax */

var elements, element, scroll;

function step() {

  elements = document.querySelectorAll( '.parallax' );

  scroll = window.scrollY;

  for( var index = 0; index < elements.length; index++ ) {

    element = elements[ index ];

    var top = element.offsetTop;

    var height = element.offsetHeight;

    var image = element.getElementsByTagName( 'img' )[ 0 ];

    if( scroll > top - height && scroll < top + height ) {

      var distance = top - scroll;

      image.style.webkitTransform = 'translateY(' + distance + 'px)';

    }

    if( top > scroll + height ) {

      image.style.webkitTransform = 'translateY(' + height + 'px)';

    }

    if( top + height < scroll ) {

      image.style.webkitTransform = 'translateY(-' + height + 'px)';

    }

  }

  window.requestAnimationFrame( step );

}

window.requestAnimationFrame( step );
