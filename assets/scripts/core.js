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





/* ---------- Menu to Anchors ---------- */
/* Function */
function scrollToAnchor(aid){
	var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

/* Link triggers */
$('#link_home').click(function(){
	scrollToAnchor("Home")
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

});
