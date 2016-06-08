$(document).on('ready', function() {
	function stickMenu(){
		var headHeight = $('.headerMain').outerHeight();
		var navHeight = $('.navMain').outerHeight();
		var scrollPos  = $(window).scrollTop();
		var scrollDistance = scrollPos - headHeight;

		if (scrollDistance >= 0) {
			$('body').addClass('nav-stuck');
			$('body').css('padding-top', navHeight);
		} else {
			$('body').removeClass('nav-stuck');
			$('body').css('padding-top', '');
		}
	}

	stickMenu();
	$(window).scroll(stickMenu);
});