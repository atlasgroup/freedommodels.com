$('.view-book').click( function() {

  $( 'html, body' ).animate({ scrollTop : $( this ).parent()[ 0 ].offsetTop + $( this ).parent()[ 0 ].offsetHeight } , 600 );

});

$('.view-miriam-polaroids').click( function() {

  $( 'html, body' ).animate({ scrollTop : $( this ).parent()[ 0 ].offsetTop + $( this ).parent()[ 0 ].offsetHeight } , 600 );

});

$('.view-kota-polaroids').click( function() {

  $( 'html, body' ).animate({ scrollTop : $( this ).parent()[ 0 ].offsetTop + $( this ).parent()[ 0 ].offsetHeight } , 600 );

});

$('.view-lily-polaroids').click( function() {

  $( 'html, body' ).animate({ scrollTop : $( this ).parent()[ 0 ].offsetTop + $( this ).parent()[ 0 ].offsetHeight } , 600 );

});

$('.view-megan-polaroids').click( function() {

  $( 'html, body' ).animate({ scrollTop : $( this ).parent()[ 0 ].offsetTop + $( this ).parent()[ 0 ].offsetHeight } , 600 );

});

/* Close */

$( '.close-book , .close-polaroids' ).click( function( event ) {

  event.preventDefault();

  $( 'html, body' ).animate({ scrollTop : $( this ).parent().prevAll( '.model' )[ 0 ].offsetTop } , 600 , function() {

    document.getElementById( event.currentTarget.getAttribute( 'for' ) ).checked = false;

    document.getElementById( event.currentTarget.getAttribute( 'for' ) ).nextElementSibling.checked = true;

  });

});

/* Back to top on logo */

$( '.top-menu' ).click( function() {

  $( 'html, body' ).animate( { scrollTop : 0 } , 600 , function() {

    $( '.top-menu' ).removeClass( 'sticky' );

  });

});

/* Sticky & Parallax */



window.addEventListener( 'scroll' , function() {

  /* Sticky */

  var menu = document.querySelectorAll( '.top-menu' )[ 0 ];

  var offset = window.innerHeight / 20;

  offset <= window.scrollY ? menu.classList.add( 'sticky' ) : menu.classList.remove( 'sticky' );

  /* Parallax */

  var models = document.querySelectorAll( '.model' );

  for( var index = 0 ; index < models.length ; index++ ) {

    if( window.scrollY >= models[ index ].offsetTop - window.innerHeight && window.scrollY <= models[ index ].offsetTop + window.innerHeight ) {

      console.log( 'scrolling' , models[ index ] );

      var image = models[ index ].getElementsByTagName( 'img' )[ 0 ];

      var delta = models[ index ].offsetTop - window.scrollY;

      image.style.webkitTransform = 'translateY( ' + delta / 2 + 'px )';

      image.style.mozTransform = 'translateY( ' + delta / 2 + 'px )';

      image.style.msTransform = 'translateY( ' + delta / 2 + 'px )';

      image.style.transform = 'translateY( ' + delta / 2 + 'px )';

    }

  }

});
