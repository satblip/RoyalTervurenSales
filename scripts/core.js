/*--------------------------------------

			CREATED AND DESIGNED 
					BY
		Louis Borsu & Philes Gilles
			Satprod Engineering

---------------------------------------*/
$( document ).ready(function() {



/*--------------------------------------

			VARIABLES

---------------------------------------*/

var menuHeight = $("#blocmenu").height();
var footerHeight = $(".footer").height();
var titreHeight = $('#titreacceuil').height();
var totalWidth =  window.innerWidth;
var totalHeight = window.innerHeight;
var pageinHeight = 1 ;
var passeLR;
var reccordPosition;

/*--------------------------------------

			FONCTIONS

---------------------------------------*/

var sizingPage = function(){
	

	var acceuilHeight = totalHeight-menuHeight;
	var pageaccinHeight = Math.ceil(((totalHeight-menuHeight)-titreHeight)*0.8);
	var pageaccHeight = Math.ceil(((totalHeight-menuHeight)-titreHeight));
	var pageinHeight = Math.ceil(((totalHeight-menuHeight)-footerHeight)*0.8);
	var paddingPageacc = Math.ceil(((totalHeight-menuHeight)-titreHeight)*0.1);
	var paddingPage = Math.ceil(((totalHeight-menuHeight)-footerHeight)*0.1);
	var paddinglr = Math.ceil(totalWidth*0.1) ;
	passeLR = paddinglr;
	var all = Math.ceil((totalWidth*6)+6*10);
	var pageWidth = Math.ceil(totalWidth*0.8) ;
	var pageHeight = Math.ceil((totalHeight-menuHeight)-footerHeight) ;
	var pageinWidth = Math.ceil(pageWidth);

	$('#pageacceuil').css('padding-bottom', menuHeight + 'px');
	$('#pageacceuil').css('height', acceuilHeight + 'px');

	$('.pageaccin').css('height', pageaccinHeight + 'px');
	$('.pageacc').css('height', paddingPageacc + 'px');
	$('.pageacc').css('padding', paddingPageacc + 'px');
	$('.all').css('width', all +'px');
	$('.page').css('padding-top', paddingPage + 'px');
	$('.page').css('padding-bottom', paddingPage + 'px');
	$('.page').css('padding-left', paddinglr + 'px');
	$('.page').css('padding-right', paddinglr + 'px');
	$('.page').css('width', pageWidth + 'px');
	$('.page').css('height', pageHeight + 'px');
	$('.page').css('margin-top', menuHeight + 'px');
	$('.pagein').css('height', pageinHeight + 'px');
	$('.pagein').css('Width', pageinWidth + 'px');

	// $('.pagein').append(paddingPage+ "pad " +paddinglr+ "padlr " +all+ "all " +pageWidth+ "w " +pageinWidth + 'inw ');
	
}


function horizontalNavigation(position, event) {
	var docloo = totalWidth;
	var docok = Math.ceil((docloo));
	reccordPosition = position;
	if(position != 0){
		$('html,body').animate({scrollLeft:((docok+5)*position)}, 600);
	}else{
		$('html,body').animate({scrollLeft:(docok*position)}, 600);
	}
    
    event.preventDefault();
}

function direstHorizontalNavigation(position, event) {
	var docloo = totalWidth;
	var docok = Math.ceil((docloo));
	
	if(position != 0){
		$('html,body').animate({scrollLeft:((docok+5)*position)},0);
	}else{
		$('html,body').animate({scrollLeft:(docok*position)},0);
	}
}

/*--------------------------------------

			Trigger

---------------------------------------*/

$('#link_home').click(function(){
	
	horizontalNavigation(0, event);
});
$('#link0').click(function(){
	
	horizontalNavigation(1, event);
});
$('#link1').click(function(){
	
	horizontalNavigation(2, event);
});
$('#link2').click(function(){
	horizontalNavigation(3, event);
});
$('#link3').click(function(){
	horizontalNavigation(4, event);
});
$('#link4').click(function(){
	horizontalNavigation(5, event);
});
$('#link5').click(function(){
	horizontalNavigation(6, event);
});



/*--------------------------------------

			ON RESIZE

---------------------------------------*/
var resizeAll = function(){
	setTimeout(function() {
	    menuHeight = $("#blocmenu").height();
		footerHeight = $(".footer").height();
		titreHeight = $('#titreacceuil').height();
		totalWidth =  window.innerWidth;
		totalHeight = window.innerHeight;
		pageinHeight = 1 ;
		direstHorizontalNavigation(reccordPosition);
		sizingPage();
	}, 100);
}

window.onresize = function() {
	resizeAll();
};

$('#directemail').on('blur', function(){
	resizeAll();
})

$('#directemail').on('focus', function(){
	resizeAll();
})

/*--------------------------------------

			DOCUMENT READY

---------------------------------------*/

	sizingPage();
    $("#blocmenu").click(function() {
		$(this).addClass('menutop');
		$('#lignemenuhaut').hide();
		$('#pageacceuil').fadeOut(200);
		$( ".noir" ).removeClass( "noir" ).addClass( "blanc textenoir" );
		  setTimeout(function() {
		  	$('.footer').show();
		  	$('.all').show();
		  }, 400);



	});


});



// $( "#blocmenu" ).click(function() {
// 	$('#blocmenu').addClass('menutop');
// });


/*--------------------------------------

			NO ZOOM IPAD

---------------------------------------*/

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT / GPLv2 License.
*/
(function(w){
	
	// This fix addresses an iOS bug, so return early if the UA claims it's something else.
	var ua = navigator.userAgent;
	if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
		return;
	}

    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
		x, y, z, aig;

    if( !meta ){ return; }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }
	
    function checkTilt( e ){
		aig = e.accelerationIncludingGravity;
		x = Math.abs( aig.x );
		y = Math.abs( aig.y );
		z = Math.abs( aig.z );
				
		// If portrait orientation and in one of the danger zones
        if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
			if( enabled ){
				disableZoom();
			}        	
        }
		else if( !enabled ){
			restoreZoom();
        }
    }
	
	w.addEventListener( "orientationchange", restoreZoom, false );
	w.addEventListener( "devicemotion", checkTilt, false );

})( this );

// /*--------------------------------------

// 			Visite 3d

// ---------------------------------------*/


