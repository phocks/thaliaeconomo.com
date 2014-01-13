/**
 * Core Javascript file.
 * @author Cue <cue@opx.co.uk>
 * @version $Id$
 */
$(document).ready(function(){ Base.__construct(); });

/**
 * Determines whether IE6 is being used. What an idiot.
 * @global IE6
 * @type bool
 */
var IE6 = ($.browser.msie && parseInt($.browser.version, 10) <= 6);


/*
 * Base Object references common methods and functions used globally or inheritted
 * by various objects with such dependencies. It acts as the core object if
 * something somewhere doesn't have it's own object handler or used as a generic
 * handler for less common objectives.
 * @author Cue <cue@opx.co.uk>
 */
var Base = {
	/**
	 * Object constructor initializes the object base.
	 * @access public
	 */
	__construct: function(){
		$(document).ready(function(){
			new BackgroundImg();
		});
	}
};

var BackgroundImg = function(){
	var self = this;
	this.dimensions = {w:1024,h:760};
	this.win = $(window);
	this.body = $('body');
	
	if (screen.availWidth <= this.dimensions.w || screen.availHeight <= this.dimensions.h) return;

	this.url = this.body.css('background-image').replace(/^url\(("|')?|("|')?\);?$/g, '') || false;
	if(!this.url || this.url === "none" || this.url === "") return;

	this.ratio = this.dimensions.w / this.dimensions.h;

	this.bgImage = $('<img />').attr({'src':this.url, 'id':'bg-expand'});

	this.wrapper = $('<div></div>').css({
		'overflow' : 'hidden',
		'width' : '100%',
		'height' : '100%',
		'z-index' : '-1'
	}).append(this.bgImage).appendTo(this.body);

	if(IE6) {
		this.wrapper.addClass('ie6fixed');
	} else {
		this.wrapper.css({'position':'fixed', 'top':0, 'left':0});
	};

	var $this = this;
	this.win.resize(function(){
		var win = {h:$this.win.height(), w:$this.win.width()},
			ratio = win.w / win.h;

		if(win.w < $this.dimensions.w && win.h < $this.dimensions.h) {
			$this.body.removeClass('wide').removeClass('tall');
		} else if((win.w < $this.dimensions.w && win.h >= $this.dimensions.h) || (ratio < $this.ratio)) {
			$this.body.removeClass('wide').removeClass('tall');
			$this.bgImage.css('left', Math.min(((win.w - $this.dimensions.w) / 2), 0));
		} else if (win.w >= $this.dimensions.w) {
			$this.body.addClass('wide').removeClass('tall');
			$this.bgImage.css('left', 0);
		};

		// Need to fix the height of the wrapper for IE6
		if (IE6) {
			$this.wrapper.css('height', win.h);
		}
	});

	this.win.trigger('resize');
};