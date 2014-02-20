function horizontalNavigation(position, event) {
	var docloo = document.innerWidth || document.documentElement.clientWidth;
	var docok = Math.ceil((docloo));
    $('html,body').animate({scrollLeft:(docok*position)}, 600);
    event.preventDefault();
}

$(document).ready(function(){   
// $('#slide_home').parallax("center", 0, 0.1, true);
// $('#slide0').parallax("center", 650, 0.1, true);
// $('#slide1').parallax("center", 1300, 0.1, true);


/* ---------- Resize Regarding Browser Height ---------- */
/* Functions */
var slideSizing = function(browser_height){
	$('#slide_home, #slide0, #slide1, #slide2, #slide3, #slide4, #slide5').css("height",browser_height-120)
}
var getBrowserHeight = function(){
	browser_height = $(window).height();
	if (browser_height < 650){
		browser_height = 650;
	}
	return browser_height;
}

/* Browser Triggers */
$(window).resize(function(){
	browser_height = getBrowserHeight();
	slideSizing(browser_height);
});
$(window).load(function(){
	browser_height = getBrowserHeight();
	slideSizing(browser_height);
});
/* ---------- EO Resize Regarding Browser Height ---------- */





 // ---------- Menu to Anchors ---------- 
/* Function */
function scrollToAnchor(aid){
	var aTag = $("a[name='"+ aid +"']");
	var docWidth = document.outerWidth || document.documentElement.clientWidth;
    $('html,body').animate({scrollTo: aTag.offset().top},600);
}

$( "#blocmenu" ).click(function() {
	menubouge();
  	$('#pageacceuil').hide();
  	$('#titreacceuil').hide();
  	$('#wrap').show('slow');
  	$( ".noir" ).removeClass( "noir" ).addClass( "blanc textenoir" );
  	$( ".ligneblanche" ).removeClass( "ligneblanche" ).addClass( "lignenoir" );
  	$('#wrap').addClass('margins')
  setTimeout(function() {
 	$('#blocmenu').removeClass('transition')
  	$('.footer').show();
  }, 400);

});


/* Link triggers */
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
/* ---------- EO Menu to Anchors ---------- */



/* ---------- Resize et Sizing de la page ---------- */
$(window).resize(function(){
	sizingPage();
	menubouge2();
	
});

$(window).load(function(){
	sizingPage();
});



var sizingPage = function()
{
	var docWidth = document.innerWidth || document.documentElement.clientWidth;
	var docHeight = document.innerHeight || document.documentElement.clientHeight;
	console.log(docWidth + " - " + docHeight);
	var marginWidth = Math.ceil((docWidth*0.2)/2);
	var marginheight = Math.ceil((docHeight*0.2)/2);
	if (marginheight < 60){
		marginheight = 60;
	};
	var contentheight = Math.ceil((docHeight*0.79));
	var contentwidth = Math.ceil((docWidth*0.79));
	var contentheightdeux = Math.ceil((docHeight*0.72));
	var margintop = Math.ceil((docHeight*0.13));
	var long = Math.ceil((docWidth*8));
	console.log(marginWidth + " - " + marginheight + 'px');
	$('.acceuila').css("height", marginheight + 'px');
	$('.acceuilb').css("height", marginheight + 'px');
	$('.acceuilstuff').css("height", contentheight-60-marginheight + 'px');
	$('.acceuilstuff').css("width", contentwidth + 'px');
	$('.acca').css("width", marginWidth + 'px');
	$('.accb').css("width", marginWidth + 'px');
	$('.resize').css("padding-left", marginWidth + 'px');
	$('.resize').css("padding-right", marginWidth + 'px');
	$('.page').css("width", docWidth + 'px');
	$('.page').css("top", margintop + 'px');
	$('.footer').css("height", 68 + 'px');
	$('.page').css("height", contentheightdeux+2 + 'px');
	$('.pagein').css("height", contentheightdeux + 'px');
	$('.all').css("width", long + 'px');
	
}




/* ---------- Resize et Sizing de la page ---------- */

var menubouge = function()
{
	var docHeight = document.outerHeight || document.documentElement.clientHeight;
	

	var hauteurabouger = Math.ceil((docHeight-5-5-50));
	$('#blocmenu').css('transform', 'translateY(-'+hauteurabouger+'px)')
	console.log('tessst'+hauteurabouger);
}

var menubouge2 = function()
{
	var docHeight = document.outerHeight || document.documentElement.clientHeight;
	

	var hauteurabouger = Math.ceil((docHeight-5-5-50));

	$('#blocmenu').css('transform', 'translateY(-'+hauteurabouger+'px)')
	console.log('tessst'+hauteurabouger);
}

/* ---------- EO Resize et Sizing de la page ---------- */

});