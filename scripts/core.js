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
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

$( "#blocmenu" ).click(function() {
  $( "#pageacceuil" ).slideUp('slow');
  
  setTimeout(function() {
  	$('#blocmenu').css('position', 'fixed');
  	$('#blocmenu').css('top', '0');
  	$('#wrap').show('slow');
  	$('#enterwebsite').hide();
  	$('#header').show();
  	$('.footer').show();
  }, 600);

});

/* Link triggers */
$('#link_home').click(function(){
	scrollToAnchor("Home");
});
$('#link0').click(function(){
	scrollToAnchor("Spirit")
});
$('#link1').click(function(){
	scrollToAnchor("Events")
});
$('#link2').click(function(){
	scrollToAnchor("Studio")
});
$('#link3').click(function(){
	scrollToAnchor("Engineering")
});
$('#link4').click(function(){
	scrollToAnchor("Team")
});
$('#link5').click(function(){
	scrollToAnchor("Contact")
});
/* ---------- EO Menu to Anchors ---------- */



/* ---------- EO Resize et Sizing de la page ---------- */

});

/* ---------- Resize et Sizing de la page ---------- */
$(window).resize(function(){
	sizingPage();
});

$(window).load(function(){
	sizingPage();
});


var sizingPage = function()
{
	var docWidth = document.outerWidth || document.documentElement.clientWidth;
	var docHeight = document.outerHeight || document.documentElement.clientHeight;
	console.log(docWidth + " - " + docHeight);
	var marginWidth = Math.ceil((docWidth*0.2)/2);
	var marginheight = Math.ceil((docHeight*0.2)/2);
	if (marginheight < 60){
		marginheight = 60;
	};
	var contentheight = Math.ceil((docHeight*0.79));
	var contentwidth = Math.ceil((docWidth*0.79));
	console.log(marginWidth + " - " + marginheight);
	$('.acceuila').css("height", marginheight);
	$('.acceuilb').css("height", marginheight);
	$('.acceuilstuff').css("height", contentheight-60);
	$('.acceuilstuff').css("width", contentwidth);
	$('.acca').css("width", marginWidth);
	$('.accb').css("width", marginWidth);
	$('.resize').css("padding-left", marginWidth);
	$('.resize').css("padding-right", marginWidth);
}