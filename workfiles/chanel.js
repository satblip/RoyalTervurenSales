 /**
 * Chanel Homepage Corpo Scripts
 * @author : Clement Caillard
 *
 */
(function($, window) {
	"use strict";
	
	/** CONFIG */
	jQuery.fx.interval = 10;
	var CONFIG = {
		//GENERIC
		//langTabIso639: {"en_US":"en","en_CA":"en","en_AU":"en","en_GB":"en","en_AS":"en","en_SG":"en","en_HK":"en","ar_ME":"ar","pt_BR":"pt","fr_CA":"fr","fr_FR":"fr","fr_BE":"fr","es_LX":"hu","es_ES":"es","nl_BE":"nl","nl_NL":"nl","de_DE":"de","it_IT":"it","zh_CN":"zh-Hans","ru_RU":"ru","ko_KR":"ko","ja_JP":"ja","zh_HK":"zh-Hant","zh_TW":"hr"}, 
		//SPECIFIC INSIDE
		langTabIso639: {"en_US":"en","en_CA":"en","en_AU":"en","en_GB":"en","en_AS":"en","en_SG":"en","en_HK":"en","ar_ME":"en","pt_BR":"pt","fr_CA":"fr","fr_FR":"fr","fr_BE":"fr","es_LX":"es","es_ES":"es","nl_BE":"en","nl_NL":"en","de_DE":"de","it_IT":"it","zh_CN":"zh-Hans","ru_RU":"ru","ko_KR":"ko","ja_JP":"ja","zh_HK":"zh-Hant","zh_TW":"zh-Hant"},  
		slideshowDuration: 6000,
		scrollDuration: 750,
		swfBufferPath: "swf/loader_#color#.swf", 
		swfPlayerPath: "swf/player.swf",
		ooyalaPlayerUrl: "http://player.ooyala.com/player.js",
		mobileWidthLimit: 640,
		ratioTab: {
			portrait_mobile: "0.9030100334448161",
			landscape_mobile: "1.777777777777778",
			portrait_mobile_2X: "0.9030100334448161",
			landscape_mobile_2X: "1.777777777777778",
			portrait: "0.9035294117647059",
			landscape_ipad: "1.667752442996743",
			portrait_2X: "0.9035294117647059",
			landscape_ipad_2X: "1.667752442996743",
			1024: "1.777777777777778",
			1280: "1.777777777777778",
			1600: "1.777777777777778",
			1920: "1.777777777777778"
		}
	}
	var SUPPORT = {
		isFlash: (typeof(swfobject) != 'undefined' && swfobject.getFlashPlayerVersion().major) ? true : false,
		versionFlash: (typeof(swfobject) != 'undefined' && swfobject.getFlashPlayerVersion().major) ? swfobject.getFlashPlayerVersion().major : false,
		isIpad: navigator.userAgent.match(/iPad/i),
		isRetina: (window.devicePixelRatio > 1),
		isIE: $.browser.msie,
		versionIE: ($.browser.msie) ? parseInt($.browser.version) : null
	}


	/** SELECTEURS */
	var $body = $('body');
	var $mediaController = $('#media-controller');
	var $replayButton = $mediaController.find('.replay-button');
	var $slides = $('#bg-fixed').find('.slide');
	var $container = $('#container');
	var $servicesBox = $('#services');
	var $footer = $('#footer');
	var $content = $('#content');
	var $mainNav = $('#main-nav');
	var $btnscroll = $('#btn-scroll');
	var $languageBox = $('#language');
	var jscrollContainer = null;

	
	/** VARIABLES */
	var timerSlideshow = null;
	var slideIndex = $('#bg-fixed .slide.default').index();
	var nbSlide = $slides.length;
	var isScrollingManual = true;
	//var locale = $body.data('lang');
	var jsonpath = $body.data('json');
	var base = $body.data('base');
	var timerScrollResize = null
	var timerOrientation = null;
	var timerSwitchImage = null;
	var timerScrollTo = null;
	var onLoadPopin = false;
	var trackWT = null;
	
	
	/** SWITCH IMAGES RESOLUTION */ 
	function switchImagesResolution(resolution) {
		if ($body.data('resolution') != resolution) {
			$body.data('resolution', resolution);
			window.screenformat = resolution;
			$('.cover').each(function() {
				var $this = $(this);
				$this.css('visibility', "hidden").attr('src', $this.data('path') + resolution + '_' + $this.data('basesrc'));
			});
		}
	}
	
	
	/** SLIDESHOW */ 
	function stopSlideshow() {
		clearInterval(timerSlideshow);
	}
	
	function playSlideshow() {
		clearInterval(timerSlideshow); //SECURE
		if (nbSlide > 1) {
			timerSlideshow = setInterval(function() {
				slideIndex++;
				if (slideIndex >= nbSlide) { slideIndex = 0; }
				
				$mediaController.css('display', "none");
				$slides.stop().animate({opacity: 0}, 300, function() { $(this).css('visibility', "hidden").removeClass('active'); });
				$slides.eq(slideIndex).stop().css({opacity: 0, visibility: "visible"}).delay(300).animate({opacity: 1}, 400, function() { $(this).addClass('active'); });
				
				if ($slides.eq(slideIndex).data('video')) {
					var $wrapperVideo = $slides.eq(slideIndex).find('.wrapper-video');
					var videoAPI = $wrapperVideo.data('player');
	
					if (!$wrapperVideo.data('played')) { // Si la video n'a jamais été joué, on la joue
						stopSlideshow();
						$replayButton.css('visibility', "hidden");
						videoAPI.play();
					} else { // Sinon on affiche le bouton replay
						$replayButton.css('visibility', "visible");
					}
					$mediaController.css('display', "block");
				}
			}, CONFIG.slideshowDuration);
		}
	}
	
	
	/** IMAGES PRELOADING */ 
	function preload(callback) {
		$('.cover').imagesLoaded(function() { 
			resizeImage();
			resizeVideo();
			setTimeout(function() {
				$('.cover').css('visibility', "visible");
				if (typeof(callback) == "function") { callback(); }
			
				// Play slideshow if no video
				if ($('#bg-fixed .slide.default').data('video')) {
					if (!$btnscroll.hasClass('tobottom')) {  
						$mediaController.css('display', "block");
					}
				} else {
					playSlideshow();
				}
			}, 200);
	    });
	}
	
	
	/** MAGNETISM */
	function scrollStop() {
		if (isScrollingManual) {
		    if ($mainNav.offset().top > 12 && $mainNav.offset().top < $footer.position().top+7) { //IE8 FIX marge de sécurité 12 au lieu de 7
			    trackWT.tracking(trackWT.config.ch_scat1, "scroll", "");
			    scrollTo();
		    } else {
		    	if (($mainNav.offset().top <= 7 && !$btnscroll.hasClass('tobottom')) || ($mainNav.offset().top >= $footer.position().top+7 && $btnscroll.hasClass('tobottom'))) {
		    		switchScrollButton();
		    	}
		    	if (!$btnscroll.hasClass('tobottom')) {  
	    			$mediaController.css('display', "block");
	    		}
		    	$('#container .jscroll-scrollbar.vertical').stop().animate({opacity: 0}, 300);
		    }
		}
	}
	
	function switchScrollButton() {
		var anchor = $btnscroll.data('anchor');
		var href = "#"+$btnscroll.attr('href').split('#')[1];
		
		$btnscroll.attr('href', anchor);
		$btnscroll.data('anchor', href);
		
		$btnscroll.toggleClass('tobottom');
		if ($btnscroll.hasClass('tobottom')) {  
			$mediaController.css('display', "none");
		}
		
		if (SUPPORT.isIE && SUPPORT.versionIE == 8 && $('#bg-fixed .slide.active').find('.wrapper-video').length && $('#bg-fixed .slide.active').find('.wrapper-video').data('ready')) {
			var videoAPI = $('#bg-fixed .slide.active').find('.wrapper-video').data('player');
			if ($btnscroll.hasClass('tobottom')) {  
				videoAPI.pause();
			} else {
				if (!$('#bg-fixed .slide.active').find('.wrapper-video').data('played')) {
					videoAPI.play();
				}
			}
		}
	}
	
	function scrollTo() {
		clearTimeout(timerScrollTo);
		isScrollingManual = false;
		$('#offscroll').css('display', "block");
		
		timerScrollTo = setTimeout(function() {
			var href = "#"+$btnscroll.attr('href').split('#')[1];
			var newPos = $container[0].jscrollTop+$(href).position().top;
			
			switchScrollButton();
			jscrollContainer.scrollTo(0, newPos, CONFIG.scrollDuration);
			setTimeout(function() { 
				isScrollingManual = true; 
				$('#offscroll').css('display', "none"); 
				$('#container .jscroll-scrollbar.vertical').stop().animate({opacity: 0}, 100); 
				if (!$btnscroll.hasClass('tobottom')) {  
					$mediaController.css('display', "block");
				}
			}, CONFIG.scrollDuration+50);
		}, 100);
	}
	
	function magnetism() {
		$btnscroll.on('click', function() {
			scrollTo();
			return false;
		});
		
		$(document).on('keydown', function(e) {
			switch (e.keyCode) { 
				case 38: // fleche du haut
					e.preventDefault();
					var newPos = Math.min($container[0].jscrollTop, 100);
					jscrollContainer.scrollTo(0, newPos, 100);
					break;
				case 40: // fleche du bas
					e.preventDefault();
					var newPos = Math.max($container[0].jscrollTop+($container[0].jscrollHeight-$container.height()), 0);
					if (newPos > 0) {
						jscrollContainer.scrollTo(0, newPos, 100);
					}
					break;
			} 
		});
		
		$container.on('scrollstart', function() {
			$mediaController.css('display', "none");
			//$('#offscroll').css('display', "block");
			$('#container .jscroll-scrollbar.vertical').stop().css('opacity', 1);
		});
		$container.on('scrollend', scrollStop);
	}
	
	
	/** VIDEO */
	function initVideo() {
		// Add wrapper-video
		var indexVideo = 0;
		if (!Modernizr.touch || screenWidth > CONFIG.mobileWidthLimit) {
			$slides.each(function() {
				var $this = $(this);
				
				if ($this.data('video')) {
					indexVideo++;
					var urlVideo = "";
					var style = "";
					var $elmt = $this;
					
					if (!Modernizr.touch) {
						$elmt = $this.find('a');
						$elmt.append('<div class="buffer-video" data-loadercolor="' + $this.data('loadercolor') + '"><div id="buffer-video-' + indexVideo + '"></div></div>');
						urlVideo = $this.data('ooyala-id-dekstop');
					} else {
						$elmt.append('<div class="play-video"></div>');
						urlVideo = $this.data('ooyala-id-tablet');
						style = "visibility: hidden;";
					}
					
					$elmt.append('<div class="wrapper-video" id="video_' + indexVideo + '" data-ooyala-id="' + urlVideo + '" data-ratio="1.77777777777778" style="' + style + '"></div>'); //TODO ratio video à dynamiser dans le json
				}
			});
		} else {
			$mediaController.remove();
			
			$slides.each(function() {
				var $this = $(this);
				
				if ($this.data('video')) {
					var $poster = $this.find('.poster');
					
					if ($poster.data('secondary_basesrc')) { 
	                	$poster.attr('src', $poster.data('path') + window.screenformat + '_' + $poster.data('secondary_basesrc'));
	                	// On ecrase les images de début (pour ne switcher qu'avec les images de fin)
	                	$poster.data('basesrc', $poster.data('secondary_basesrc'));
	                	$poster.data('posterchange', true);
	                }
				}
			});
		}
		
		// No FLash Alert
		/*if (!SUPPORT.isFlash && $('.buffer-video').length) {
			openPopin('#popin-noflash');
		}*/
		
		// Buffer video
		if (SUPPORT.isFlash && SUPPORT.versionFlash >= 10) {
			var params = {
				quality: "high",
				scale: "noscale",
				allowscriptaccess: "always",
				wmode: "transparent"
			};
			var flashvars = {};
			
			$('.buffer-video').each(function() {
				var idElmt = $(this).children().attr('id');
				var attributes = {
					name: "buffer_video_content", 
					id: idElmt
				};
				var swfloader = base + CONFIG.swfBufferPath.replace('#color#', $(this).data('loadercolor'));
				swfobject.embedSWF(swfloader, idElmt, "100px", "100px", "10", false, flashvars, params, attributes);
			});
		}
		
		// Video controller Ooyala
		$('.wrapper-video').each(function() {
			var $this = $(this);
			var urlVideo = $this.data('ooyala-id');
			var id = $this.attr('id');	
			$this.data('autoplay', true);
			
			var sPublisher = "Ultranova";
			var oPlayer = OO.Player.create(id, urlVideo, {
				wmode:'transparent', width: 640, height: 360, hide: 'all', layout: 'chromeless',
				flashParams:{
					hide: 'all',
					devModuleCategory: 'other',
					layout: 'chromeless',
					devModuleURL: base + CONFIG.swfPlayerPath,
					width: '100%',
					height: '100%',
					'thruParam_uichanel[chanel_style]': 'bs:0;ab:75;st:1;dc:true;cl:fr_FR;cbc:#FFFFFF;cbch:#FFFFFF;cls:false;cbbc:#000000;sbc:#FFFFFF;sbbc:#393939;cbh:20;cberp:PTSVF;cls:1',
					'thruParam_uichanel[config_file_url]': 'config.xml'
				},
				onCreate: function(player) {
					player.mb.subscribe("*", sPublisher, function(status, time, total) {
						//console.log(status, time, total);
						var $wrapperVideo = $this;
						var $video = $wrapperVideo.find('.innerWrapper');
						var $slide = $wrapperVideo.parents('.slide');
						var $poster = $slide.find('.poster');
						var videoAPI = player;
						
						if (status == "playbackReady") {
							$wrapperVideo.data('ready', true);
				            $wrapperVideo.data('played', false);
				            
				            // Resize video
				            $video.css({ width:"100%", height:"100%" });
				            resizeVideo();
				            
				            // Liseret FIX
				            $wrapperVideo.append('<div class="video-liseret-fix-left"></div><div class="video-liseret-fix-right"></div><div class="video-liseret-fix-top"></div><div class="video-liseret-fix-bottom"></div>'); // DIRTY HARRY
				            $wrapperVideo.css('visibility', "visible"); // IPAD FIX
				            
				            // Check volume
				            var volume = $mediaController.data('volume');
				            videoAPI.setVolume(volume);
				            
				            // Play video if slide active
				            if (Modernizr.touch) {
				            	$slide.find('.play-video').css('display', "block").on("click", function() {
				            		videoAPI.play();
				            		$(this).off("click");
				            	});
				            } else if ($slide.hasClass('active') && $wrapperVideo.data('autoplay')) {
				            	videoAPI.play();
				            } else {
				            	$slide.find('.buffer-video, .play-video').css('display', "none");
				            }
						}
				      	
						if (status == "playing") {
			            	$video.css('visibility', "visible");
			            	
			                // On masque le poster et le buffer
			            	if (SUPPORT.isIE && SUPPORT.versionIE < 9) {
			            		$poster.css('display', "none");
			            	}
			                $poster.fadeOut(400, function() {
			                    var $this = $(this);
			                    
			                	// On remplace le poster par l'image de fin
			                    if ($this.data('secondary_basesrc') && !$this.data('posterchange')) { //TODO if already resize, check body.data('resolution')
			                    	$this.attr('src', $this.data('path') + window.screenformat + '_' + $this.data('secondary_basesrc'));
			                    	
			                    	// On ecrase les images de début (pour ne switcher qu'avec les images de fin)
			                    	$this.data('basesrc', $this.data('secondary_basesrc'));
			                    	
			                    	$this.data('posterchange', true);
			                    	//resizeImage(); //pas utile si les 2 poster font la même taille
			                    }
			                });
			                $slide.find('.buffer-video, .play-video').css('display', "none");

							// Sous-titre
			                if ($slide.data('subtitle')) {
			                	videoAPI.setClosedCaptionsLanguage(CONFIG.langTabIso639[locale]); //TODO a verifier API ooyala
			                }
			            }
						
						if (status == "played") {
				        	$wrapperVideo.data('played', true);
				        	
				            // On affiche l'image de fin et le bouton replay
				        	$poster.fadeIn(400, function() {
				        		$video.css('visibility', "hidden");
				        		if (SUPPORT.isIE && SUPPORT.versionIE < 9) { this.style.removeAttribute('filter'); } // IE8 FIX
				        		playSlideshow();
				            });
				        	$replayButton.css('visibility', "visible");
				        }

				   	});
				}
			});
			
			$this.data('player', oPlayer);
			
			//$(window).on('blur', function() {
			$slides.children('a').on('click', function() {
				var $wrapperVideo = $this;
				var $video = $wrapperVideo.find('.innerWrapper')
				var $slide = $wrapperVideo.parents('.slide');
				var $poster = $slide.find('.poster');
				var videoAPI = oPlayer;
				
				if (typeof videoAPI !== 'undefined') {
					videoAPI.pause();
				}

				$wrapperVideo.data('autoplay', false);
				$wrapperVideo.data('played', true);
	        	
	            // On affiche l'image de fin et le bouton replay
	        	$poster.fadeIn(400, function() {
	        		$video.css('visibility', "hidden");
	        		if (SUPPORT.isIE && SUPPORT.versionIE < 9) { this.style.removeAttribute('filter'); } // IE8 FIX
	            });
	        	$mediaController.css('display', "block");
	        	$replayButton.css('visibility', "visible");
			});
		});
		
		// Media Controller
		$mediaController.find('.sound-button').on('click', function() {
			var volume = $mediaController.data('volume');
			
			$(this).toggleClass('off');
			if (volume == 1) {
				volume = 0;
			} else {
				volume = 1;
			}
			
			$('.wrapper-video').each(function() {
				if ($(this).data('player')) {	
					var videoAPI = $(this).data('player');
					videoAPI.setVolume(volume);
				}
			});
			
			$mediaController.data('volume', volume);
	        return false;
	    });
		$replayButton.on('click', function() {
			stopSlideshow();
			$(this).css('visibility', "hidden");
			
			$('#bg-fixed .slide.active').find('.wrapper-video').data('played', false);
			
			var videoAPI = $('#bg-fixed .slide.active').find('.wrapper-video').data('player');
			videoAPI.play();

	        return false;
		});
	}
	
	
	/** POPIN */
	function openPopin(hash) {
		onLoadPopin = true;
		if (hash == '#languages' && !$(hash).data('loaded')) { writeLanguagePopin(); }
		if (hash == '#legal' && !$(hash).data('loaded')) { writeLegalPopin(); }
		if (hash == '#privacy' && !$(hash).data('loaded')) { writePrivacyPopin(); }
		$('.popin, #popin').css('visibility', "visible").css('display', "none");
		$('#popin, ' + hash).css('display', "block");
		$(hash).find('.jscroll').trigger('refresh');
		$(hash).find('iframe').attr("src", $(hash).find('iframe').data('src'));
		
		/*
		// CRPS-17 - inactive
		$(document).on('keyup.corpo', function(e) {
			if (e.which == 27) {
				e.preventDefault();
				location.href = '#';
			}
		});
 		*/
	}
	function closePopin() {
		$('#popin').css('display', "none");
		// $(document).off('keyup.corpo');
	}
	function writeLanguagePopin() {
		$('#languages').data('loaded', true);
		$.getJSON($body.data('languagesjson'), function(json) {
			var $languages = $('#languages').find('.wrapper-valign-fix');
			var str = "";
			var continentLength = 0;
			
			for (var i in json.languages.continent) continentLength++;
			
			$.each(json.languages.continent, function(i, continent) {
				str += '<div class="popin-column';
				if (i == continentLength-1) { str += ' last'; }
				str += '"><h3>' + continent.title + '</h3><ul>';
				
				$.each(continent.countries, function(j, country) {
					if (country.title != "") {
						str += '<li>';
						
						if (country.child) {
							str += '<span class="countries"><span>' + country.title + '</span>'
								
							$.each(country.child, function(k, dialecte) {
								str += '<a href="' + base + dialecte.link + '" class="link-country" data-lang="' + dialecte['data-lang'] + '" data-wt="true" data-chscat2="HP languages Popin" data-chprod="languages link ' + dialecte['data-chprod'] + '">' + dialecte.title + '</a>';
							});
							
							str += '</span>';
						} else {
							str += '<a href="' + base + country.link + '" class="link-country" data-lang="' + country['data-lang'] + '" data-wt="true" data-chscat2="HP languages Popin" data-chprod="languages link ' + country['data-chprod'] + '">' + country.title + '</a>';
						}
						
						str += '</li>';
					} else {
						str += '<li class="empty"></li>';
					}
				});
				
				str += '</ul></div>';
			});
			
			if (typeof json.languages.international != 'undefined') {
				var international = json.languages.international;
				
				str += '<div class="popin-column popin-column-unique"><ul>';
				
				$.each(international.countries, function(j, country) {
					if (country.title != "") {
						str += '<li>';
						
						if (country.child) {
							str += '<span class="countries"><span>' + country.title + '</span>'
								
							$.each(country.child, function(k, dialecte) {
								str += '<a href="' + base + dialecte.link + '" class="link-country" data-lang="' + dialecte['data-lang'] + '" data-wt="true" data-chscat2="HP languages Popin" data-chprod="languages link ' + dialecte['data-chprod'] + '">' + dialecte.title + '</a>';
							});
							
							str += '</span>';
						} else {
							str += '<a href="' + base + country.link + '" class="link-country" data-lang="' + country['data-lang'] + '" data-wt="true" data-chscat2="HP languages Popin" data-chprod="languages link ' + country['data-chprod'] + '">' + country.title + '</a>';
						}
						
						str += '</li>';
					} else {
						str += '<li class="empty"></li>';
					}
				});
				
				str += '</ul></div>';
			}
			
			$languages.append(str);
			
			$('.touch .popin-column h3').on('click', function() {
				var $this = $(this);
				var $ul = $this.parents('.popin-content').find('ul');
				var $next = $this.next();
				$ul.not($next).css('display', "none");
				//if (!$next.is(':visible')) {
					$next.toggle();
				//}
				$this.parents('.jscroll').trigger('refresh');
			});
			$('.link-country').on('click', function() {
				createCookie('hp_lang', $(this).data('lang'), 362/2);
			});
			
			$('#languages').find('.jscroll').trigger('refresh');
		});
	}
	function writeLegalPopin() {
		$('#legal').data('loaded', true);
		$.getJSON($body.data('legaljson'), function(json) {
			var $this = $('#legal .popin-content');
			var jsonNode = $this.data('jsonnode');
			$this.find('.jscroll').html(json[jsonNode].text + '<br /><br />').jScroll();
		});
	}
	function writePrivacyPopin() {
		$('#privacy').data('loaded', true);
		$.getJSON($body.data('privacyjson'), function(json) {
			var $this = $('#privacy .popin-content');
			var jsonNode = $this.data('jsonnode');
			$this.find('.jscroll').html(json[jsonNode].text + '<br /><br />').jScroll();
		});
	}
	
	
	/** RESIZE IMAGES */
	function resizeImage() {
		var docWidth = window.innerWidth || document.documentElement.clientWidth;
		var docHeight = window.innerHeight || document.documentElement.clientHeight;

		/** IMAGE MARGIN **/
		var ratioVerticalMargin = Math.min((docHeight-500)*100/460, 100); // 500 = 0% , 960 = 100%
		var ratioHorizontalMargin = Math.min((docWidth-640)*100/640, 100); // 640 = 0% , 1280 = 100%
		var ratioMargin = Math.min(ratioVerticalMargin, ratioHorizontalMargin);
		$('#bg-fixed .slide[data-margin]').each(function() {
			var $this = $(this);
			var defautMargin = $this.data('margin');
	    	var newMargin = Math.max(defautMargin*ratioMargin/100, 30); //min 15px
	    	$this.css({ top: newMargin + 'px', bottom: newMargin + 'px', borderWidth: '0 ' + newMargin + 'px' });

	    	if (SUPPORT.isIE && SUPPORT.versionIE < 8) { // TOPBOTTOM + BOX-SIZING FIX IE < 8
				var newHeight = $this.parent().height() - (2 * newMargin);
				var newWidth = $this.parent().width() - (2 * newMargin) - 16;
	    		$this.css({ height: newHeight + 'px', width: newWidth + 'px' });
	    	}
		});

		/** IMAGE RESIZE **/
		$('.no-crop').each(function() {
			var $this = $(this);
			
			var ratio = CONFIG.ratioTab[window.screenformat];
			var avalaibleWidth = $this.parents('.slide').width();
			var avalaibleHeight = $this.parents('.slide').height();
			
			var newWidth = Math.round(avalaibleWidth);
			var newHeight = Math.round(newWidth / ratio);
			if (newHeight > avalaibleHeight) {
				newHeight = Math.round(avalaibleHeight);
				newWidth = Math.round(newHeight * ratio);
			}
			
			$this.css({ position: 'absolute', width: newWidth+'px', height: newHeight+'px', marginTop: '-'+(newHeight/2)+'px', marginLeft: '-'+(newWidth/2)+'px' });
		});
		$('.img-fill').each(function() {
			var $this = $(this);
			$this.css({ position: 'absolute', width: '100%', height: 'auto' });
			if ($this.height() < $this.parents('.slide').height()) {
				$this.css({ position: 'absolute', width: 'auto', height: '100%' });
			}
		});
		$('.crop-valign-middle').each(function() {
			var $this = $(this);
			$this.css({ position: 'absolute', marginTop: '-'+($this.height()/2)+'px' });
		});
		$('.crop-halign-center').each(function() {
			var $this = $(this);
			$this.css({ position: 'absolute', marginLeft: '-'+($this.width()/2)+'px' });
		});
	}

	
	/** RESIZE VIDEO */
	function resizeVideo() {
		var docWidth = window.innerWidth || document.documentElement.clientWidth;
		var docHeight = window.innerHeight || document.documentElement.clientHeight;
		
		$('.wrapper-video').each(function() {
			var $this = $(this);
			var $poster = $this.parents('.slide').find('.cover');
			var ratioVideo = $this.data('ratio');
			//var widthAvailable = $this.width();
			//var heightAvailable = $this.height();
			var widthPoster = $poster.width();
			var heightPoster = $poster.height();
			var ratioPoster = widthPoster / heightPoster;

			if ($poster.hasClass('no-crop')) {
				/*if (heightAvailable * ratioVideo > widthAvailable) {
					var newHeight = widthAvailable / ratioVideo;
					$video.css({ position: 'absolute', width: '100%', height: newHeight + 'px', marginLeft: '-' + (widthAvailable / 2) + 'px', marginTop: '-' + (newHeight / 2) + 'px' });
				} else {
					var newWidth = heightAvailable * ratioVideo;
					$video.css({ position: 'absolute', width: newWidth + 'px', height: '100%', marginLeft: '-' + (newWidth / 2) + 'px', marginTop: '-' + (heightAvailable / 2) + 'px' });
				}*/
				
				if (ratioPoster > ratioVideo) {
					var newWidth = heightPoster * ratioVideo;
					$this.css({ position: 'absolute', width: newWidth + 'px', height: heightPoster + 'px', marginLeft: '-' + (newWidth / 2) + 'px', marginTop: '-' + (heightPoster / 2) + 'px' });
				} else {
					var newHeight = widthPoster / ratioVideo;
					$this.css({ position: 'absolute', width: widthPoster + 'px', height: newHeight + 'px', marginLeft: '-' + (widthPoster / 2) + 'px', marginTop: '-' + (newHeight / 2) + 'px' });
				}
			} else {
				if ($poster.hasClass('img-fill')) {
					var newWidth  = $this.parents('.slide').width();
					var newHeight = newWidth / ratioVideo;
					
					if (newHeight < $this.parents('.slide').height()) {
						newHeight = $this.parents('.slide').height();
						newWidth = newHeight * ratioVideo;
					}
					
					$this.css({ position: 'absolute', width: newWidth + 'px', height: newHeight + 'px' });
				}
				
				if ($poster.hasClass('crop-valign-middle')) {
					$this.css({ position: 'absolute', marginTop: '-'+($this.height()/2)+'px' });
					$this.addClass('no-lisere-vertical');
				}
				if ($poster.hasClass('crop-halign-center')) {
					$this.css({ position: 'absolute', marginLeft: '-'+($this.width()/2)+'px' });
					$this.find('.video-liseret-fix-left, .video-liseret-fix-right').css('display', "none");
					$this.addClass('no-lisere-horizontal');
				}
			}
			
			var $wrapperVideo = $this;
			var $video = $wrapperVideo.find('.innerWrapper')
			var $slide = $wrapperVideo.parents('.slide');
			var $poster = $slide.find('.poster');
			var videoAPI = $wrapperVideo.data('player');
			
			if (docWidth <= CONFIG.mobileWidthLimit) {
				$mediaController.addClass('invisible');

				if (typeof videoAPI !== 'undefined') {
					videoAPI.pause();
				}

				$wrapperVideo.data('autoplay', false);

	            // On affiche l'image de fin et le bouton replay
				if ($poster.data('secondary_basesrc') && !$poster.data('posterchange')) { 
                	$poster.attr('src', $poster.data('path') + window.screenformat + '_' + $poster.data('secondary_basesrc'));
                	// On ecrase les images de début (pour ne switcher qu'avec les images de fin)
                	$poster.data('basesrc', $poster.data('secondary_basesrc'));
                	$poster.data('posterchange', true);
                }
				$poster.css('display', "block");
	        	$video.css('visibility', "hidden");
	        	if (SUPPORT.isIE && SUPPORT.versionIE < 9) { $poster.style.removeAttribute('filter'); } // IE8 FIX
	        	$replayButton.css('visibility', "visible");
			} else {
				$mediaController.removeClass('invisible');
				
				if (!$wrapperVideo.data('played')) { // Si la video n'a jamais été joué, on la joue
					stopSlideshow();
					$replayButton.css('visibility', "hidden");
					if (typeof videoAPI !== 'undefined') {
						videoAPI.play();
					}
				} else { // Sinon on affiche le bouton replay
					$replayButton.css('visibility', "visible");
				}
			}
		});
	}
	
	
	/** RESIZE WINDOW */
	function resizeWindow() {
		clearTimeout(timerScrollTo);
		isScrollingManual = false;
		clearTimeout(timerScrollResize);
		clearTimeout(timerSwitchImage);
		
		var docWidth = window.innerWidth || document.documentElement.clientWidth;
    	var docHeight = window.innerHeight || document.documentElement.clientHeight;
    	
		if (typeof(window.orientation) === "undefined") {
			timerSwitchImage = setTimeout(function() {
				stopSlideshow();
				var screenformat = window.originalscreenformat;
				if (docHeight > docWidth) { // TODO faire un switch selon le ratio: portrait et landscape ipad et mobile ou window.originalscreenformat
					screenformat = "portrait";
				}
				switchImagesResolution(screenformat);
				preload();
			}, 200);
		}
		
		// Resize NAV
		if (docWidth > CONFIG.mobileWidthLimit) { //TODO ne pas faire en fonction de docWidth mais en fonction de si les truc mobile sont :visible
			var menuHeight = $mainNav.outerHeight() + 7 + 5;
			if ($btnscroll.css('position') == "relative") {
				menuHeight += $btnscroll.height();
			}
		} else { // Version mobile
			var menuHeight = 40 + 7;
		}
		
		var diffHeight = $('body').height() - docHeight; //iOS7 FIX
		var availableHeight = docHeight - menuHeight;
		$mediaController.css('bottom', (menuHeight + 5 +diffHeight) + 'px');
		$('#bg-fixed, #bg-ghost-area').css('height', availableHeight + 'px');
		$footer.css('height', docHeight + 'px');

		// SERVICES BOX FILL REMAINING HEIGHT
		if ($servicesBox.is(':visible')) {
			$servicesBox.css('padding', "0px").height('auto');
			var footerHeight = $footer.height();
			var contentHeight = $content.height();
			if (footerHeight >= contentHeight) {
				var servicesTopPos = $servicesBox.offset().top;
				var languagesTopPos = $languageBox.offset().top;
				var remainingSpace = languagesTopPos - servicesTopPos;
				$servicesBox.height(remainingSpace);
			} else {
				$servicesBox.css('padding', "0 0 35px");
			}
		}
		
		$footer.css('height', Math.max($content.height(), docHeight) +'px');
		jscrollContainer.refresh();
		
		$container.find('.jscroll-content-wrap').css('visibility', "visible");
		
		resizeImage();
		resizeVideo();
		
		// RELAUNCH MAGNETISM
		if ($btnscroll.hasClass('tobottom')) {
			//scroll to nav
			jscrollContainer.scrollTo(0, $container[0].jscrollTop+$footer.position().top, 150);
			$mediaController.css('display', "none");
			setTimeout(function() { isScrollingManual = true; }, 200);
		} else {
			//scroll to top
			isScrollingManual = true;
			$mediaController.css('display', "block");
		}
	}


	/** INIT */
	function init() {	
		var docWidth = window.innerWidth || document.documentElement.clientWidth;
		
		if ($('#popin-tsunami').length) {
			openPopin('#popin-tsunami');
		}
		
		if (isTablet || isMobile) {
			$slides.find('a').each(function() {
				var $this = $(this);
				if ($this.data('link-url-tablet')) {
					$this.attr('href', $this.data('link-url-tablet'));
				}
			});
		}

		$body.data('resolution', "portrait_mobile"); // Mobile first
		switchImagesResolution(window.screenformat);
		preload(initVideo);
		
		$('#container').scrollTop(0);
		$container.jScroll({},function() {
			trackWT = new CHANEL_TRACKING({
				lib: $body.data('wtlib'), 
				ch_lang: $body.data('chlang'), 
				device: device, 
				ch_div: "homepages", 
				ch_re: "chanelcom", 
				ch_cat: {
					mobile: "CHANELcom MOBILE",
					tablet: "CHANELcom TABLET",
					desktop: "CHANELcom WWW"
				}, 
				ch_scat1: "HP Local Homepage"/*,
				loadTag: {
					ch_scat1: "HP Local Homepage",
					ch_scat2: "HP main View",
					ch_prod: ""
				}*/
			});
			
			$servicesBox = $('#services');
			$footer = $('#footer');
			$content = $('#content');
			$languageBox = $('#language');
			$mainNav = $('#main-nav');
			$btnscroll = $('#btn-scroll');
			
			/** CLICK THROUGH */
			$('#bg-ghost-area').on('click', function(event) {
				$container.css('z-index', "-1");
			    var target = document.elementFromPoint(event.clientX, event.clientY);
		    	try { 
		    		target.click(); 
		    	} catch(e) { // IPAD VIDEO FIX
		    		$(target).trigger('click');
		    		if ($(target).parent('a').length) {
		    			//if ($(target).parent('a').attr('target') == "_BLANK") {
		    				window.open($(target).parent('a').attr('href'));
		    			/*} else {
		    				location.href = $(target).parent('a').attr('href');
		    			}*/
		    		}
		    	}
			    $container.css('z-index', "50");
			});
			
			if (location.hash == '#footer') {
				scrollTo();
		    }
		});	
		jscrollContainer = $container.data('jScroll');
		magnetism();
		
		/** SWITCH IMAGE PUSH */
		if (docWidth > CONFIG.mobileWidthLimit && SUPPORT.isRetina) {
			$('.thumbnail, .thumbnail-over').each(function() {
				var $this = $(this);
				if ($this.data('basesrc').indexOf("http://") == -1) {
					$this.attr('src', $this.data('path') + '2X_' + $this.data('basesrc'));
				}
			});			
		}
		
		/** FILL POPIN */
		if (Modernizr.touch || window.navigator.msPointerEnabled) {
			$('.popin-column-type').find('.jscroll').jScroll();
			$('.popin-link-type').find('.jscroll').jScroll();
		}
		$.getJSON(jsonpath, function(json) {
			$('.popin-content[data-jsonnode]').each(function() {
				var $this = $(this);
				var jsonNode = $this.data('jsonnode');
				if (typeof json[jsonNode].text != 'undefined') {
					$this.find('.jscroll').html(json[jsonNode].text + '<br /><br />').jScroll();
				}
			});
		});
		/*$('iframe').each(function() {
			var $this = $(this);
			$this.parents('.popin, #popin').css('visibility', "hidden").css('display', "block");
			var $iframe = $(this);
			$iframe.attr("src", $iframe.data('src'));
			setTimeout(function() {
				if (!onLoadPopin) {
					$this.parents('.popin, #popin').css('visibility', "visible").css('display', "none");
				}
			}, 3000);
		});*/
	
		/** POPIN */
		$(window).on('hashchange', function(){
			if ($(location.hash).hasClass('popin')) {
				openPopin(location.hash);
			} else {
				closePopin();
			}
		});
		$('.close, .mask, .cancel').on('click', function() {
			$(this).parents('.close-target').css('display', "none");
			location.href = '#';
		});
		if (location.hash != '' && $(location.hash).length && $(location.hash).hasClass('popin')) {
	    	openPopin(location.hash);
	    }

		/** TABLET SCREEN ORIENTATION */
		if (typeof(window.orientation) !== "undefined") {
			$(window).on('orientationchange', function() {
				clearTimeout(timerOrientation);
				stopSlideshow();
				window.scrollTo(0); //iOS7 FIX
				timerOrientation = setTimeout(function() {
					var mql = window.matchMedia("(orientation: portrait)");
					var docWidth = window.innerWidth || document.documentElement.clientWidth;
					var screenformat = (docWidth > CONFIG.mobileWidthLimit) ? "landscape_ipad" : "landscape_mobile";
					if (mql.matches) {  
						screenformat = (docWidth > CONFIG.mobileWidthLimit) ? "portrait" : "portrait_mobile";
					}
					if (SUPPORT.isRetina) {
						screenformat += "_2X";
					}
					switchImagesResolution(screenformat);
					preload();
				}, 500);
			});
		}
		
		$(window).resize(resizeWindow);
		setTimeout(function() { resizeWindow(); }, 200); // CHROME RESIZE TOO FAST FIX

		// Chinese licence ICP
		var akamaiCookie = readCookie('country');
		if (akamaiCookie !== null && akamaiCookie === 'CN') {
			$('#footer').addClass('chinese-context');
		}
			
		/** UNAVAILABLE */
		$('.unavailable').on('click', function() {
			var $this = $(this);
			$('#popin-unavailable').find('.confirm').attr('href', $this.attr('href')).attr('target', $this.attr('target'));
			openPopin('#popin-unavailable');
			return false;
		});
	}
	
	$(document).ready(init);
	
})(jQuery, window);